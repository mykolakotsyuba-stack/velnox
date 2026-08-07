<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('type', 40);                 // analogue/resource/batch/custom/oem/distributor/contact
            $table->string('type_label')->nullable();   // human-readable label
            $table->string('to_email')->nullable();      // routed recipient
            $table->text('contact');                     // full contact payload (name/phone/email/message/...)
            $table->string('article')->nullable();       // parsed product article, if present
            $table->json('files')->nullable();           // attached filenames
            $table->string('locale', 5)->nullable();     // uk/pl/en (from referer)
            $table->string('source')->nullable();        // originating page path
            $table->string('ip', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('status', 20)->default('new'); // new/sent/failed
            $table->timestamps();

            $table->index('type');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
