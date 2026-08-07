<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminLeadController extends Controller
{
    /**
     * Shared-password gate. Password comes from the X-Admin-Password header
     * (or ?key= for direct downloads) and is compared to config('app.leads_admin_password').
     */
    private function passes(Request $request): bool
    {
        $secret = (string) config('app.leads_admin_password');
        if ($secret === '') {
            return false; // not configured → deny everything
        }
        $provided = (string) ($request->header('X-Admin-Password') ?? $request->query('key', ''));
        return $provided !== '' && hash_equals($secret, $provided);
    }

    /**
     * GET /api/v1/admin/leads — filtered list + aggregate stats.
     */
    public function index(Request $request)
    {
        if (!$this->passes($request)) {
            return response()->json(['error' => 'unauthorized'], 401);
        }

        $query = Lead::query()->orderByDesc('created_at');

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($locale = $request->query('locale')) {
            $query->where('locale', $locale);
        }
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('contact', 'like', "%{$search}%")
                  ->orWhere('article', 'like', "%{$search}%");
            });
        }

        $perPage = min(max((int) $request->query('per_page', 30), 1), 100);
        $leads   = $query->paginate($perPage);

        return response()->json([
            'stats' => [
                'total'     => Lead::count(),
                'by_type'   => Lead::selectRaw('type, count(*) c')->groupBy('type')->pluck('c', 'type'),
                'by_status' => Lead::selectRaw('status, count(*) c')->groupBy('status')->pluck('c', 'status'),
                'by_locale' => Lead::selectRaw('locale, count(*) c')->groupBy('locale')->pluck('c', 'locale'),
                'by_day'    => Lead::selectRaw('date(created_at) d, count(*) c')
                    ->where('created_at', '>=', now()->subDays(14))
                    ->groupBy('d')->orderBy('d')->get(),
            ],
            'leads' => $leads->getCollection()->map(fn (Lead $l) => [
                'id'         => $l->id,
                'type'       => $l->type,
                'type_label' => $l->type_label,
                'to_email'   => $l->to_email,
                'contact'    => $l->contact,
                'article'    => $l->article,
                'files'      => $l->files,
                'locale'     => $l->locale,
                'source'     => $l->source,
                'ip'         => $l->ip,
                'status'     => $l->status,
                'created_at' => optional($l->created_at)->toIso8601String(),
            ]),
            'pagination' => [
                'current_page' => $leads->currentPage(),
                'last_page'    => $leads->lastPage(),
                'per_page'     => $leads->perPage(),
                'total'        => $leads->total(),
            ],
        ]);
    }

    /**
     * GET /api/v1/admin/leads/{lead}/file/{index} — download one attachment.
     */
    public function downloadFile(Request $request, Lead $lead, int $index)
    {
        if (!$this->passes($request)) {
            return response()->json(['error' => 'unauthorized'], 401);
        }

        $files = $lead->files ?? [];
        if (!isset($files[$index]['path'])) {
            abort(404);
        }
        $path = $files[$index]['path'];
        if (!Storage::disk('local')->exists($path)) {
            abort(404);
        }

        return Storage::disk('local')->download($path, $files[$index]['name'] ?? null);
    }
}
