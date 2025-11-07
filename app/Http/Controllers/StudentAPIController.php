<?php

namespace App\Http\Controllers;

use App\Models\Tenant\StudentAttendance;
use App\Models\Tenant\Students;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StudentAPIController extends Controller
{
    public function getAllStudents()
    {
        $students = Students::select([
            'students.student_id as id',
            DB::raw("concat(last_name, ' ', first_name) as name"),
            'class_name as class',
            'section_name',
            'classes.class_id as classId',
            DB::raw("DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), dob)), '%Y') + 0 as age"),
        ])
            ->leftJoin('class_student', 'students.student_id', 'class_student.student_id')
            ->leftJoin('classes', 'class_student.class_id', 'classes.class_id')
            ->leftJoin('sections', 'sections.section_id', 'class_student.section_id')
            ->where('students.student_status', 'active')
            ->get();

        $attendance = Students::select([
            'students.student_id as studentId',
            'attendance_id as id',
            'attendance_date as date',
            'check_in_time as checkInTime',
            'check_out_time as checkOutTime',
            'status',
            'class_student.class_id as classId'
        ])
            ->leftJoin('student_attendance', 'students.student_id', 'student_attendance.student_id')
            ->leftJoin('class_student', 'students.student_id', 'class_student.student_id')
            ->where('students.student_status', 'active')
            ->where('attendance_date', date('Y-m-d'))
            ->get();


        return response()->json(compact('students', 'attendance'));
    }

    public function studentAttendanceCheckIn(Request $request)
    {
        $user = Auth::id();
        StudentAttendance::updateOrCreate([
            'student_id' => $request->studentId,
            'attendance_date' => date('Y-m-d'),
        ], [
            'class_id' => $request->classId,
            'check_in_time' => $this->getTime(),
            'status' => 'present',
            'recorded_by' => $user,
        ]);
    }

    public function studentAttendanceCheckOut(Request $request)
    {
        StudentAttendance::updateOrCreate([
            'student_id' => $request->studentId,
            'attendance_date' => date('Y-m-d'),
        ], [
            'check_out_time' => $this->getTime(),
        ]);
    }

    private function getTime()
    {
        $now = Carbon::now('Asia/Kuala_Lumpur')->format('H:i:s');
        return $now;
    }
}
