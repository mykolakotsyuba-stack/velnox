<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class LeadController extends Controller
{
    private const EMAIL_ENGINEERING = 'engineering@velnox.eu';
    private const EMAIL_SALES       = 'sales@velnox.eu';
    private const EMAIL_INFO        = 'info@velnox.eu';

    private const TYPE_TO_EMAIL = [
        'analogue'    => self::EMAIL_ENGINEERING,
        'resource'    => self::EMAIL_ENGINEERING,
        'custom'      => self::EMAIL_ENGINEERING,
        'oem'         => self::EMAIL_ENGINEERING,
        'batch'       => self::EMAIL_SALES,
        'distributor' => self::EMAIL_SALES,
        'contact'     => self::EMAIL_INFO,
    ];

    private const TYPE_LABELS = [
        'analogue'    => 'Підбір за зразком',
        'resource'    => 'Прорахунок ресурсу',
        'batch'       => 'Замовлення партії',
        'custom'      => 'Кастомне рішення',
        'oem'         => 'OEM-запит',
        'distributor' => 'Запит від дистриб\'ютора',
        'contact'     => 'Контактна форма',
    ];

    public function engineerRequest(Request $request)
    {
        $validated = $request->validate([
            'contact' => 'required|string|max:2000',
            'type'    => 'required|string|in:' . implode(',', array_keys(self::TYPE_TO_EMAIL)),
            'file'    => 'nullable|file|mimes:jpg,jpeg,png,heic,pdf,webp|max:10240',
            'files'   => 'nullable|array|max:10',
            'files.*' => 'file|mimes:jpg,jpeg,png,heic,pdf,webp|max:10240',
        ]);

        $contact   = $validated['contact'];
        $type      = $validated['type'];
        $typeLabel = self::TYPE_LABELS[$type] ?? $type;
        $toEmail   = self::TYPE_TO_EMAIL[$type] ?? self::EMAIL_INFO;

        // Collect attachments from both the single `file` field (HomePage/ContactForm)
        // and the multi `files[]` field (custom-solution form). Both are optional.
        $uploads = [];
        if ($request->hasFile('file')) {
            $uploads[] = $request->file('file');
        }
        if ($request->hasFile('files')) {
            $uploads = array_merge($uploads, $request->file('files'));
        }

        $attachments = []; // [ ['path' => absPath, 'name' => originalName, 'stored' => relativePath], ... ]
        foreach ($uploads as $i => $upload) {
            if ($upload && $upload->isValid()) {
                $stored = $upload->storeAs(
                    'leads',
                    'lead_' . time() . '_' . $i . '.' . $upload->getClientOriginalExtension(),
                    'local'
                );
                $attachments[] = [
                    // Laravel 12 'local' disk root is storage/app/private, so resolve the
                    // real absolute path via the disk instead of assuming storage/app/*.
                    'path'   => Storage::disk('local')->path($stored),
                    'name'   => $upload->getClientOriginalName() ?: basename($stored),
                    'stored' => $stored,
                ];
            }
        }

        // --- Persist the lead FIRST so no submission is ever lost, even if mail fails ---
        $referer = (string) $request->headers->get('referer', '');
        $path     = $referer ? (parse_url($referer, PHP_URL_PATH) ?: '') : '';
        $locale   = null;
        if ($path && preg_match('#/(uk|pl|en)(/|$)#', $path, $lm)) {
            $locale = $lm[1];
        }
        $article = null;
        if (preg_match('/(?:Артикул|Nr\s*artykułu|Article)\s*:?\s*([A-Za-z0-9][A-Za-z0-9\-\.\/ ]{1,60}?)\s*(?:\/|$)/u', $contact, $am)) {
            $article = trim($am[1]);
        }

        $lead = Lead::create([
            'type'       => $type,
            'type_label' => $typeLabel,
            'to_email'   => $toEmail,
            'contact'    => $contact,
            'article'    => $article,
            'files'      => $attachments
                ? array_map(fn ($a) => ['name' => $a['name'], 'path' => $a['stored']], $attachments)
                : null,
            'locale'     => $locale,
            'source'     => $path ?: null,
            'ip'         => $request->ip(),
            'user_agent' => (string) $request->userAgent(),
            'status'     => 'new',
        ]);

        try {
            Mail::send([], [], function ($message) use ($contact, $typeLabel, $toEmail, $attachments) {
                $filesRow = '';
                if (!empty($attachments)) {
                    $names = array_map(fn ($a) => htmlspecialchars($a['name']), $attachments);
                    $filesRow = '<tr><td style="padding:8px 0;color:#6b7280;vertical-align:top;">Файли:</td>'
                        . '<td style="padding:8px 0;color:#111;">' . implode('<br>', $names) . '</td></tr>';
                }
                $message
                    ->to($toEmail)
                    ->subject('[VELNOX] ' . $typeLabel)
                    ->html(
                        '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">'
                        . '<div style="background:#2E2981;padding:24px;border-radius:12px 12px 0 0;">'
                        . '<h2 style="color:#fff;margin:0;font-size:20px;">⚙️ ' . htmlspecialchars($typeLabel) . '</h2>'
                        . '</div>'
                        . '<div style="background:#f9fafb;padding:28px;border-radius:0 0 12px 12px;">'
                        . '<table style="width:100%;border-collapse:collapse;">'
                        . '<tr><td style="padding:8px 0;color:#6b7280;width:140px;">Тип запиту:</td>'
                        . '<td style="padding:8px 0;font-weight:600;color:#111;">' . htmlspecialchars($typeLabel) . '</td></tr>'
                        . '<tr><td style="padding:8px 0;color:#6b7280;vertical-align:top;">Контакт:</td>'
                        . '<td style="padding:8px 0;font-weight:600;color:#111;white-space:pre-line;">' . htmlspecialchars($contact) . '</td></tr>'
                        . $filesRow
                        . '</table>'
                        . '<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">'
                        . '<p style="color:#9ca3af;font-size:12px;margin:0;">VELNOX · velnox.eu</p>'
                        . '</div></div>'
                    );

                foreach ($attachments as $a) {
                    if (file_exists($a['path'])) {
                        $message->attach($a['path'], ['as' => $a['name']]);
                    }
                }
            });

            // Attachments are kept on disk (storage/app/private/leads) so the admin
            // panel can still download them — nothing is discarded after sending.
            $lead->update(['status' => 'sent']);

            return response()->json(['success' => true, 'id' => $lead->id]);

        } catch (\Exception $e) {
            Log::error('LeadController: mail error — ' . $e->getMessage());
            $lead->update(['status' => 'failed']);
            // Lead is already persisted; report the mail failure so the client can retry.
            return response()->json(['success' => false, 'error' => 'mail_error'], 500);
        }
    }
}
