<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TagGroups extends Model
{
    use HasUuids;
    protected $table = 'tag_groups';
    protected $primaryKey = 'tag_group_id';
    protected $fillable = [
        'tag_group',
        'tag_color',
    ];
}
