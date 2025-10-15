<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Tags extends Model
{
    use HasUuids;
    protected $table = 'tags';
    protected $primaryKey = 'tag_id';

    protected $fillable = [
        'tag',
        'by_admin',
        'tag_group_id',
        'parent_id',
        'tag_status',
        'created_by',
    ];
}
