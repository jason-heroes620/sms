<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Timetables extends Model
{
    use HasUuids;

    protected $table = 'timetables';
    protected $primaryKey = 'timetable_id';
    protected $fillable = [
        'academic_year_id',
        'branch_id',
        'is_publish',
        'created_by'
    ];

    protected $casts = [
        'is_publish' => 'boolean',
    ];
}
