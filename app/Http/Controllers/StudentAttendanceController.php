<?php

namespace App\Http\Controllers;

use App\Models\Tenant\StudentAttendance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentAttendanceController extends Controller
{
    public function updateAttendance(Request $request)
    {
        $user = Auth::id();

        StudentAttendance::updateOrCreate(
            [
                'student_id' => $request->input('student_id'),
                'attendance_date' => Carbon::today(),
            ],
            [
                'class_id' => $request->input('class_id'),
                'recorded_by' => $user,
                'remarks' => $request->input('remarks'),
                'status' => $request->input('attendance'),
            ]
        );
    }
}
