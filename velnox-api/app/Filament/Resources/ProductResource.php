<?php

namespace App\Filament\Resources;

use App\Models\Product;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Tabs;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BooleanColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Actions\ImportAction;
use Illuminate\Database\Eloquent\Builder;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;
    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationLabel = 'Продукти';
    protected static ?string $modelLabel = 'Товар';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([

            // ─── ОСНОВНА ІНФОРМАЦІЯ ───────────────────────────────────────────
            Section::make('Основна інформація')->schema([
                TextInput::make('article')
                    ->label('Артикул')
                    ->required()
                    ->maxLength(50),
                TextInput::make('fkl_designation')
                    ->label('Позначення FKL (внутрішнє)')
                    ->maxLength(50),
                Select::make('category_id')
                    ->label('Категорія')
                    ->options(Category::pluck('name_en', 'id'))
                    ->required()
                    ->searchable(),
                Toggle::make('is_active')
                    ->label('Активний')
                    ->default(true),
            ])->columns(2),

            // ─── ТЕХНІЧНІ ПАРАМЕТРИ (specs JSONB) ─────────────────────────────
            Section::make('Технічні параметри')->schema([
                TextInput::make('specs.d')
                    ->label('d — внутрішній діаметр (мм)')
                    ->numeric(),
                TextInput::make('specs.D')
                    ->label('D — зовнішній діаметр (мм)')
                    ->numeric(),
                TextInput::make('specs.B')
                    ->label('B — ширина (мм)')
                    ->numeric(),
                TextInput::make('specs.C')
                    ->label('C (мм)')
                    ->numeric(),
                TextInput::make('specs.alpha')
                    ->label('α — кут контакту (°)')
                    ->numeric(),
                TextInput::make('specs.mass')
                    ->label('Маса (кг)')
                    ->numeric(),
                TextInput::make('specs.Cdyn')
                    ->label('Cdyn — динамічне навантаження (кН)')
                    ->numeric(),
                TextInput::make('specs.Co')
                    ->label('Co — статичне навантаження (кН)')
                    ->numeric(),
                TextInput::make('specs.Pu')
                    ->label('Pu (кН)')
                    ->numeric(),
            ])->columns(3),

            // ─── OEM КРОС-РЕФЕРЕНСИ ───────────────────────────────────────────
            Section::make('OEM Крос-референси')->schema([
                Repeater::make('oem_cross')
                    ->label('OEM артикули (замінники)')
                    ->schema([
                        TextInput::make('value')->label('Артикул OEM')->required(),
                    ])
                    ->addActionLabel('Додати артикул')
                    ->collapsible(),
            ]),

            // ─── ЗАСТОСУВАННЯ ─────────────────────────────────────────────────
            Section::make('Застосування (техніка)')->schema([
                Repeater::make('installations')
                    ->label('Перелік техніки')
                    ->schema([
                        TextInput::make('value')->label('Назва техніки')->required(),
                    ])
                    ->addActionLabel('Додати техніку')
                    ->collapsible(),
            ]),

            // ─── ПЕРЕКЛАДИ (Tabs по мовах) ────────────────────────────────────
            Section::make('Переклади та описи')->schema([
                Tabs::make('Мови')->tabs([
                    Tabs\Tab::make('🇬🇧 English')->schema([
                        TextInput::make('translations.en.product_name')
                            ->label('Назва товару (EN)'),
                        Textarea::make('translations.en.sealing_desc')
                            ->label('Опис ущільнень (EN)')
                            ->rows(3),
                    ]),
                    Tabs\Tab::make('🇺🇦 Українська')->schema([
                        TextInput::make('translations.uk.product_name')
                            ->label('Назва товару (UK)'),
                        Textarea::make('translations.uk.sealing_desc')
                            ->label('Опис ущільнень (UK)')
                            ->rows(3),
                    ]),
                    Tabs\Tab::make('🇵🇱 Polski')->schema([
                        TextInput::make('translations.pl.product_name')
                            ->label('Назва товару (PL)'),
                        Textarea::make('translations.pl.sealing_desc')
                            ->label('Опис ущільнень (PL)')
                            ->rows(3),
                    ]),
                ]),
            ]),

            // ─── МЕДІА ────────────────────────────────────────────────────────
            Section::make('Медіа файли')->schema([
                TextInput::make('model_3d_url')->label('URL 3D-моделі'),
                TextInput::make('drawing_url')->label('URL креслення'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('article')
                    ->label('Артикул')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('fkl_designation')
                    ->label('FKL')
                    ->searchable(),
                TextColumn::make('category.name_en')
                    ->label('Категорія')
                    ->sortable(),
                TextColumn::make('specs.Cdyn')
                    ->label('Cdyn (кН)')
                    ->sortable(),
                TextColumn::make('specs.d')
                    ->label('d (мм)'),
                TextColumn::make('specs.D')
                    ->label('D (мм)'),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Активний')
                    ->boolean(),
                TextColumn::make('updated_at')
                    ->label('Оновлено')
                    ->dateTime('d.m.Y')
                    ->sortable(),
            ])
            ->filters([
                // Фільтр по категорії
                SelectFilter::make('category')
                    ->label('Категорія')
                    ->relationship('category', 'name_en'),

                // Фільтр по наявності 3D-моделі
                Filter::make('has_3d_model')
                    ->label('Має 3D-модель')
                    ->query(fn(Builder $q) => $q->whereNotNull('model_3d_url')),

                // Діапазон Cdyn
                Filter::make('cdyn_range')
                    ->label('Cdyn діапазон')
                    ->form([
                        TextInput::make('cdyn_min')->label('Cdyn від (кН)')->numeric(),
                        TextInput::make('cdyn_max')->label('Cdyn до (кН)')->numeric(),
                    ])
                    ->query(function (Builder $q, array $data) {
                        if ($data['cdyn_min']) {
                            $q->whereRaw("(specs->>'Cdyn')::numeric >= ?", [$data['cdyn_min']]);
                        }
                        if ($data['cdyn_max']) {
                            $q->whereRaw("(specs->>'Cdyn')::numeric <= ?", [$data['cdyn_max']]);
                        }
                    }),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->headerActions([
                // Кнопка імпорту JSON з 1С
                Tables\Actions\Action::make('import_1c')
                    ->label('Імпорт з 1С (JSON)')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('success')
                    ->url('/admin/products/import'),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => \App\Filament\Resources\ProductResource\Pages\ListProducts::route('/'),
            'create' => \App\Filament\Resources\ProductResource\Pages\CreateProduct::route('/create'),
            'edit'   => \App\Filament\Resources\ProductResource\Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
