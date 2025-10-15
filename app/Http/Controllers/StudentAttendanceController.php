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
                'student_id' => $request->input('student_id')
            ],
            [
                'attendance' => $request->input('attendance'),
                'created_by' => $user,
                'created_at' => Carbon::today(),
                'update_at' => Carbon::today()
            ]
        );
    }
}
