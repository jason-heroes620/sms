<?php

use App\Http\Controllers\Auth\AuthAPISessionController;
use App\Http\Controllers\StudentAPIController;
use App\Http\Controllers\TagAPIController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserAPIController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('login', [AuthAPISessionController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {

    // Students
    Route::get('students', [StudentAPIController::class, 'getAllStudents']);
    Route::post('student_attendance/check_in', [StudentAPIController::class, 'studentAttendanceCheckIn']);
    Route::post('student_attendance/check_out', [StudentAPIController::class, 'studentAttendanceCheckOut']);

    Route::get('tags', [TagAPIController::class, 'getAllTags'])->name('api.tags.getAllTags');
    Route::get('generateComment', [TagAPIController::class, 'generateComment'])->name('api.tags.generateComment');
    Route::post('assessments', [TagAPIController::class, 'assessments'])->name('api.tags.assessments');

    Route::get('leaves/{id}', [UserAPIController::class, 'leaves'])->name('api.user.leaves');
    Route::post('applyLeave', [UserAPIController::class, 'applyLeave'])->name('api.user.applyLeave');

    Route::get('signOut', [AuthAPISessionController::class, 'destroy']);
});
