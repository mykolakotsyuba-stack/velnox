<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class LeadController extends Controller
{
    // Адреса, на яку приходять запити від інженерів
    private const NOTIFY_EMAIL = 'info@velnox.ua';

    public function engineerRequest(Request $request)
    {
        $validated = $request->validate([
            'contact'   => 'required|string|max:200',
            'type'      => 'required|string|in:analogue,resource,batch,custom',
            'file'      => 'nullable|file|mimes:jpg,jpeg,png,heic,pdf,webp|max:10240', // 10 MB max
        ]);

        $contact  = $validated['contact'];
        $type     = $validated['type'];

        // Людино-читабельна назва типу
        $typeLabels = [
            'analogue' => 'Підбір за зразком',
            'resource' => 'Прорахунок ресурсу',
            'batch'    => 'Замовлення партії',
            'custom'   => 'Кастомне рішення',
        ];
        $typeLabel = $typeLabels[$type] ?? $type;

        // Зберігаємо файл якщо є
        $attachPath = null;
        $attachName = null;
        if ($request->hasFile('file') && $request->file('file')->isValid()) {
            $file = $request->file('file');
            $attachName = 'detail_' . time() . '.' . $file->getClientOriginalExtension();
            $attachPath = $file->storeAs('leads', $attachName, 'local');
            $attachPath = storage_path('app/' . $attachPath);
        }

        try {
            Mail::send([], [], function ($message) use ($contact, $typeLabel, $attachPath, $attachName) {
                $message
                    ->to(self::NOTIFY_EMAIL)
                    ->subject('[VELNOX] Новий запит до інженера: ' . $typeLabel)
                    ->html(
                        '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">'
                        . '<div style="background:#2E2981;padding:24px;border-radius:12px 12px 0 0;">'
                        . '<h2 style="color:#fff;margin:0;font-size:20px;">⚙️ Новий запит до інженера</h2>'
                        . '</div>'
                        . '<div style="background:#f9fafb;padding:28px;border-radius:0 0 12px 12px;">'
                        . '<table style="width:100%;border-collapse:collapse;">'
                        . '<tr><td style="padding:8px 0;color:#6b7280;width:140px;">Тип запиту:</td>'
                        . '<td style="padding:8px 0;font-weight:600;color:#111;">' . htmlspecialchars($typeLabel) . '</td></tr>'
                        . '<tr><td style="padding:8px 0;color:#6b7280;">Контакт:</td>'
                        . '<td style="padding:8px 0;font-weight:600;color:#111;">' . htmlspecialchars($contact) . '</td></tr>'
                        . ($attachName ? '<tr><td style="padding:8px 0;color:#6b7280;">Файл:</td>'
                        . '<td style="padding:8px 0;color:#111;">' . htmlspecialchars($attachName) . '</td></tr>' : '')
                        . '</table>'
                        . '<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">'
                        . '<p style="color:#9ca3af;font-size:12px;margin:0;">VELNOX Engineering · mx.irbis.ua</p>'
                        . '</div></div>'
                    );

                if ($attachPath && file_exists($attachPath)) {
                    $message->attach($attachPath, ['as' => $attachName]);
                }
            });

            // Прибираємо файл після відправки
            if ($attachPath && file_exists($attachPath)) {
                @unlink($attachPath);
            }

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            Log::error('LeadController: mail error — ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'mail_error'], 500);
        }
    }
}
