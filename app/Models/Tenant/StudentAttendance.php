<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class StudentAttendance extends Model
{
    protected $table = 'student_attendance';
    protected $primaryKey = 'student_attendance_id';
    protected $fillable = [
        'student_id',
        'attendance',
        'attendance_image',
        'created_by',
    ];
}
