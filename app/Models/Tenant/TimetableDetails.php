<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TimetableDetails extends Model
{
    use HasUuids;

    protected $table = 'timetable_details';
    protected $primaryKey = 'timetable_detail_id';
    protected $fillable = [
        'timetable_id',
        'class_id',
        'section_id',
        'subject_id',
        'recurrence',
        'days',
        'start_time',
        'end_time',
        'color',
        'created_by',
        'timetable_detail_status'
    ];
}
