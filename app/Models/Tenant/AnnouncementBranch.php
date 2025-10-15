<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AnnouncementBranch extends Model
{
    use HasUuids;

    protected $table = 'announcement_branch';
    protected $primaryKey = 'announcement_branch_id';
    protected $fillable = [
        'branch_id',
        'class_id',
        'announcement_id',
    ];

    public $timestamps = false;
}
