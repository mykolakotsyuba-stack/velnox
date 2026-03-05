<?php

namespace App\Http\Controllers\Api;

use App\Models\NewsArticle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class NewsController extends Controller
{
    /**
     * Список статей
     * GET /api/v1/news?category=oem-solutions&locale=en
     */
    public function index(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'en');

        $query = NewsArticle::where('is_active', true)
            ->orderByDesc('published_at');

        if ($category = $request->get('category')) {
            $query->where('category', $category);
        }

        $articles = $query->paginate(12);

        return response()->json([
            'data' => $articles->getCollection()->map(fn($a) => [
                'slug'         => $a->slug,
                'category'     => $a->category,
                'cover_image'  => $a->cover_image,
                'published_at' => $a->published_at?->toDateString(),
                'title'        => $a->getTranslation($locale)['title'] ?? '',
                'excerpt'      => $a->getTranslation($locale)['excerpt'] ?? '',
            ]),
            'meta' => [
                'total'        => $articles->total(),
                'current_page' => $articles->currentPage(),
                'last_page'    => $articles->lastPage(),
            ],
        ]);
    }

    /**
     * Повна стаття
     * GET /api/v1/news/{slug}?locale=en
     */
    public function show(string $slug, Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'en');

        $article = NewsArticle::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $t = $article->getTranslation($locale);

        return response()->json([
            'slug'         => $article->slug,
            'category'     => $article->category,
            'cover_image'  => $article->cover_image,
            'published_at' => $article->published_at?->toDateString(),
            'title'        => $t['title'] ?? '',
            'excerpt'      => $t['excerpt'] ?? '',
            'body'         => $t['body'] ?? '',
        ]);
    }
}
