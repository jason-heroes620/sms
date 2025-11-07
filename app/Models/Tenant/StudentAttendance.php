<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class StudentAttendance extends Model
{
    use HasUuids;

    protected $table = 'student_attendance';
    protected $primaryKey = 'attendance_id';
    protected $fillable = [
        'student_id',
        'class_id',
        'attendance_date',
        'check_in_time',
        'check_out_time',
        'status',
        'remarks',
        'recorded_by',
    ];
}
