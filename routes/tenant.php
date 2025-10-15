<?php

declare(strict_types=1);


use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\HomeworkController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SchoolProfileController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StudentAttendanceController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TimetableController;
use App\Http\Controllers\UserController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

// Route::middleware([
//     'web',
//     Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain::class,

// ])->group(function () {
//     Route::get('/', [CenterDashboardController::class, 'index'])->name('center.dashboard');
//     // Add other tenant-specific routes here

// });
// Route::get('login', [App\Http\Controllers\Tenant\AuthController::class, 'showLoginForm'])->name('tenant.login');

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth:tenant', Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain::class])->name('dashboard');

// Route::middleware(['auth:tenant', Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain::class])->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

//     // Student Routes
//     Route::get('/students', [StudentController::class, 'index'])->name('students.index');
//     Route::get('/all_students', [StudentController::class, 'showAll'])->name('students.all');
//     Route::get('/student/create', [StudentController::class, 'create'])->name('student.create');
//     Route::post('/student/store', [StudentController::class, 'store'])->name('student.store');
//     Route::get('/students/{id}', [StudentController::class, 'edit'])->name('student.edit');
//     Route::patch('/student/{id}', [StudentController::class, 'update'])->name('student.update');

//     Route::get('/student/attendance', [StudentController::class, 'attendance'])->name('student.attendance');

//     Route::get('/getStudentByClass/{id}', [StudentController::class, 'getStudentByClass'])->name('student.getStudentByClass');

//     // Student Attendance
//     Route::post('/attendance', [StudentAttendanceController::class, 'updateAttendance'])->name('attendance.update');

//     // Class Routes
//     Route::get('/classes', [ClassController::class, 'index'])->name('classes.index');
//     Route::get('/all_classes', [ClassController::class, 'showAll'])->name('classes.all');
//     Route::get('/classes/create', [ClassController::class, 'create'])->name('class.create');
//     Route::post('/class/store', [ClassController::class, 'store'])->name('class.store');
//     Route::get('/class/{id}', [ClassController::class, 'edit'])->name('class.edit');
//     Route::patch('/class/{id}', [ClassController::class, 'update'])->name('class.update');

//     Route::get('/sections', [SectionController::class, 'index'])->name('sections.index');
//     Route::get('/all_sections', [SectionController::class, 'showAll'])->name('sections.all');


//     // Subject Routes
//     Route::get('/subjects', [SubjectController::class, 'index'])->name('subjects.index');
//     Route::get('/all_subjects', [SubjectController::class, 'showAll'])->name('subjects.all');
//     Route::get('/subject/create', [SubjectController::class, 'create'])->name('subject.create');
//     Route::post('/subject/store', [SubjectController::class, 'store'])->name('subject.store');
//     Route::get('/subject/{id}', [SubjectController::class, 'edit'])->name('subject.edit');
//     Route::patch('/subject/{id}', [SubjectController::class, 'update'])->name('subject.update');
//     Route::get('/subject-classes', [SubjectController::class, 'assign'])->name('subject.class');

//     // Homework Routes
//     Route::get('/homeworks', [HomeworkController::class, 'index'])->name('homeworks.index');
//     Route::get('/all_homeworks', [HomeworkController::class, 'showAll'])->name('homeworks.all');
//     Route::get('/homework/create', [HomeworkController::class, 'create'])->name('homework.create');
//     Route::post('/homework/store', [HomeworkController::class, 'store'])->name('homework.store');
//     Route::get('/homework/{id}', [HomeworkController::class, 'edit'])->name('homework.edit');
//     Route::get('/homework-submissions', [HomeworkController::class, 'submissions'])->name('homework.submissions');

//     Route::get('/getSubjectsByClass/{class_id}', [ClassController::class, 'getSubjectsByClass'])->name('getSubjectsByClass');

//     // Exam Routes
//     Route::get('/exams', [ExamController::class, 'index'])->name('exams.index');
//     Route::get('/all_exams', [ExamController::class, 'showAll'])->name('exams.all');
//     Route::get('/exam/create', [ExamController::class, 'create'])->name('exam.create');
//     Route::post('/exam/store', [ExamController::class, 'store'])->name('exam.store');
//     Route::get('/exam/{id}', [ExamController::class, 'edit'])->name('exam.edit');

//     // Timetables Routes
//     Route::get('/timetable', [TimetableController::class, 'view'])->name('timetable.view');
//     Route::get('/timetable/create', [TimetableController::class, 'create'])->name('timetable.create');

//     // Assessments Routes
//     Route::get('/assessments', [AssessmentController::class, 'index'])->name('assessments.index');
//     Route::get('/all_assessments', [AssessmentController::class, 'showAll'])->name('assessments.all');
//     Route::get('/assessment/create', [AssessmentController::class, 'create'])->name('assessment.create');
//     Route::post('/assessment/store', [AssessmentController::class, 'store'])->name('assessment.store');
//     Route::get('/assessment/{id}', [AssessmentController::class, 'edit'])->name('assessment.edit');


//     // Settings
//     Route::get('/school_profile', [SchoolProfileController::class, 'create'])->name('school.profile.create');
//     Route::post('/school_profile', [SchoolProfileController::class, 'update'])->name('school.profile.update');
//     // Settings for Grades
//     Route::get('/grades', [GradeController::class, 'create'])->name('grade.create');
//     Route::get('/grades/showAll', [GradeController::class, 'showAll'])->name('grade.showAll');
//     Route::post('/grade/store', [GradeController::class, 'store'])->name('grade.store');
//     Route::get('/grade/{id}', [GradeController::class, 'edit'])->name('grade.edit');
//     Route::patch('/grade/{id}', [GradeController::class, 'update'])->name('grade.update');

//     // Academic Year
//     Route::get('/academic_years', [AcademicYearController::class, 'index'])->name('academic-year');
//     Route::get('/academic_years/create', [AcademicYearController::class, 'create'])->name('academic-year.create');
//     Route::post('/academic_years/store', [AcademicYearController::class, 'store'])->name('academic-year.store');
//     Route::get('/academic_years/{id}', [AcademicYearController::class, 'edit'])->name('academic-year.edit');
//     Route::patch('/academic_years/{id}', [AcademicYearController::class, 'update'])->name('academic-year.update');
//     Route::put('/academic_years/current/{id}', [AcademicYearController::class, 'updateIsCurrent'])->name('academic-year.updateIsCurrent');

//     // Fees 
//     Route::get('/fees', [FeeController::class, 'index'])->name('fees.index');
//     Route::get('/all_fees', [FeeController::class, 'showAll'])->name('fees.showAll');
//     Route::post('/fee', [FeeController::class, 'store'])->name('fee.store');
//     Route::get('/fee/{id}', [FeeController::class, 'edit'])->name('fee.edit');
//     Route::put('/fee/{id}', [FeeController::class, 'update'])->name('fee.update');
//     Route::put('/fee_status/{id}', [FeeController::class, 'updateStatus'])->name('fee.update_status');

//     Route::get('/users', [UserController::class, 'index'])->name('users.index');
//     Route::get('/users/showAll', [UserController::class, 'showAll'])->name('users.showAll');
//     Route::get('/users/create', [UserController::class, 'create'])->name('user.create');
//     Route::post('/users/store', [UserController::class, 'store'])->name('user.store');
//     Route::get('/users/{id}', [UserController::class, 'edit'])->name('user.edit');
//     Route::put('/users/{id}', [UserController::class, 'update'])->name('user.update');
// });

// Only accessible via subdomain
// use Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain;

// Route::middleware([
//     'web',
//     InitializeTenancyBySubdomain::class,
//     'auth:sanctum',
// ])->prefix('tenant')->group(function () {
//     Route::get('/dashboard', [TenantDashboardController::class, 'index']);
//     Route::resource('branches', BranchController::class);
//     Route::resource('roles', RoleController::class);
// });