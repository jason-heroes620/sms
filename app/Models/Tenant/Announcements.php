<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Announcements extends Model
{
    use HasUuids;

    protected $table = 'announcements';
    protected $primaryKey = 'announcement_id';
    protected $fillable = [
        'title',
        'short_description',
        'description',
        'image_path',
        'created_by',
        'announcement_status'
    ];
}
