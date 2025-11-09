<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExamResultsController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\HomeworkController;
use App\Http\Controllers\HomeworkSubmissionController;
use App\Http\Controllers\IntegrationConfigurationController;
use App\Http\Controllers\IntegrationController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SchoolProfileController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StudentAttendanceController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentPackageController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TimetableController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


// Route::domain('central.localhost')->group(function () {
//     Route::get('/admin', function () {
//         return Inertia::render('AdminDashboard');
//     })->middleware(['auth', 'verified'])->name('admin.dashboard');
// });

Route::get('/clear-cache', function () {
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('route:clear');
});


Route::middleware('auth')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Student Routes
    Route::get('/students', [StudentController::class, 'index'])->name('students.index');
    Route::get('/all_students', [StudentController::class, 'showAll'])->name('students.all');
    Route::get('/student/create', [StudentController::class, 'create'])->name('student.create');
    Route::post('/student/store', [StudentController::class, 'store'])->name('student.store');
    Route::get('/students/{id}', [StudentController::class, 'edit'])->name('student.edit');
    Route::patch('/student/{id}', [StudentController::class, 'update'])->name('student.update');

    Route::get('/student/attendance', [StudentController::class, 'attendance'])->name('student.attendance');
    Route::get('/student/student_attendance', [StudentController::class, 'getStudentAttendance'])->name('student.attendanceByDay');

    Route::get('/getStudentByClass/{id}', [StudentController::class, 'getStudentByClass'])->name('student.getStudentByClass');

    // Student Attendance
    Route::post('/attendance', [StudentAttendanceController::class, 'updateAttendance'])->name('attendance.update');

    // Class Routes
    Route::get('/classes', [ClassController::class, 'index'])->name('classes.index');
    Route::get('/all_classes', [ClassController::class, 'showAll'])->name('classes.all');
    Route::get('/classes/create', [ClassController::class, 'create'])->name('class.create');
    Route::post('/classes/store', [ClassController::class, 'store'])->name('class.store');
    Route::get('/classes/{id}', [ClassController::class, 'edit'])->name('class.edit');
    Route::put('/classes/{id}', [ClassController::class, 'update'])->name('class.update');

    // Section Routes
    Route::get('/sections', [SectionController::class, 'index'])->name('section.index');
    Route::get('/sections/showAll', [SectionController::class, 'showAll'])->name('section.showAll');
    Route::get('/sections/create', [SectionController::class, 'create'])->name('section.create');
    Route::post('/sections/store', [SectionController::class, 'store'])->name('section.store');
    Route::get('/sections/{id}', [SectionController::class, 'edit'])->name('section.edit');
    Route::put('/sections/{id}', [SectionController::class, 'update'])->name('section.update');


    // Subject Routes
    Route::get('/subjects', [SubjectController::class, 'index'])->name('subjects.index');
    Route::get('/all_subjects', [SubjectController::class, 'showAll'])->name('subjects.all');
    Route::get('/subjects/create', [SubjectController::class, 'create'])->name('subject.create');
    Route::post('/subjects/store', [SubjectController::class, 'store'])->name('subject.store');
    Route::get('/subjects/{id}', [SubjectController::class, 'edit'])->name('subject.edit');
    Route::put('/subjects/{id}', [SubjectController::class, 'update'])->name('subject.update');
    Route::get('/subject-classes', [SubjectController::class, 'assign'])->name('subject.class');
    Route::post('/subject-classes', [SubjectController::class, 'assignSubjectStore'])->name('subject_class.store');

    // Homework Routes
    Route::get('/homeworks', [HomeworkController::class, 'index'])->name('homeworks.index');
    Route::get('/all_homeworks', [HomeworkController::class, 'showAll'])->name('homeworks.all');
    Route::get('/homework/create', [HomeworkController::class, 'create'])->name('homework.create');
    Route::post('/homework/store', [HomeworkController::class, 'store'])->name('homework.store');
    Route::get('/homeworks/{id}', [HomeworkController::class, 'edit'])->name('homework.edit');
    Route::put('/homeworks/{id}', [HomeworkController::class, 'update'])->name('homework.update');

    Route::get('/homeworks/submissions/{id}', [HomeworkSubmissionController::class, 'index'])->name('submissions.index');
    Route::get('/homework-submissions/showAll/{id}', [HomeworkSubmissionController::class, 'showAll'])->name('submissions.all');
    Route::put('/homework-submissions/update/{id}', [HomeworkSubmissionController::class, 'update'])->name('submissions.update');
    Route::get('/homework-submissions/show/{id}', [HomeworkSubmissionController::class, 'show'])->name('submissions.show');

    Route::get('/getSubjectsByClass/{class_id}', [ClassController::class, 'getSubjectsByClass'])->name('getSubjectsByClass');

    // Exam Routes
    Route::get('/exams', [ExamController::class, 'index'])->name('exams.index');
    Route::get('/all_exams', [ExamController::class, 'showAll'])->name('exams.all');
    Route::get('/exams/create', [ExamController::class, 'create'])->name('exam.create');
    Route::post('/exams/store', [ExamController::class, 'store'])->name('exam.store');
    Route::get('/exams/{id}', [ExamController::class, 'edit'])->name('exam.edit');
    Route::put('/exams/{id}', [ExamController::class, 'update'])->name('exam.update');
    Route::get('/exams/results/{id}', [ExamController::class, 'examResults'])->name('exam.results');

    Route::get('/exam_results/{id}', [ExamResultsController::class, 'getStudentListByClass'])->name('exam_results.by_class');
    Route::put('/exam_results/update/{id}', [ExamResultsController::class, 'updateStudentResult'])->name('exam_results.update');

    // Timetables Routes
    Route::get('/timetable', [TimetableController::class, 'view'])->name('timetable.view');
    Route::get('/timetable/create', [TimetableController::class, 'create'])->name('timetable.create');
    Route::post('/timetable/store', [TimetableController::class, 'store'])->name('timetable.store');

    // Assessments Routes
    Route::get('/assessments', [AssessmentController::class, 'index'])->name('assessments.index');
    Route::get('/all_assessments', [AssessmentController::class, 'showAll'])->name('assessments.all');
    Route::get('/assessment/create', [AssessmentController::class, 'create'])->name('assessment.create');
    Route::post('/assessment/store', [AssessmentController::class, 'store'])->name('assessment.store');
    Route::get('/assessments/{id}', [AssessmentController::class, 'edit'])->name('assessment.edit');
    Route::put('/assessment/{id}', [AssessmentController::class, 'update'])->name('assessment.update');
    Route::post('/assessment_generate', [AssessmentController::class, 'generateQuery'])->name('assessment.generate');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/student-attendance', [ReportController::class, 'studentAttendance'])->name('reports.student-attendance');
    Route::get('/reports/student-assessment', [ReportController::class, 'studentAssessment'])->name('reports.student-assessment');

    // Announcements
    Route::get('/announcements/{id?}', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('/announcement/create', [AnnouncementController::class, 'create'])->name('announcement.create');
    Route::post('/announcements/store', [AnnouncementController::class, 'store'])->name('announcement.store');
    Route::get('/announcements/show/{id}', [AnnouncementController::class, 'show'])->name('announcement.show');
    Route::get('/announcements/edit/{id}', [AnnouncementController::class, 'edit'])->name('announcement.edit');
    Route::post('/announcements/update/{id}', [AnnouncementController::class, 'update'])->name('announcement.update');
    Route::put('/announcements/publish/{id}', [AnnouncementController::class, 'publish'])->name('announcement.publish');
    Route::put('/announcements/archive/{id}', [AnnouncementController::class, 'archive'])->name('announcement.archive');

    // Billing

    // Billing
    Route::get('billings', [BillingController::class, 'index'])->name('billings.index');
    Route::get('billings/showAll', [BillingController::class, 'showAll'])->name('billings.showAll');
    Route::post('billings/store', [BillingController::class, 'store'])->name('billings.store');

    // Invoices
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/all_invoices', [InvoiceController::class, 'showAll'])->name('invoices.showAll');
    Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
    Route::post('/invoices/store', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('/invoices/{id}', [InvoiceController::class, 'edit'])->name('invoices.edit');
    Route::put('/invoices/{id}', [InvoiceController::class, 'update'])->name('invoices.update');

    Route::post('billing/generate', [BillingController::class, 'generate'])->name('billing.generate');

    // Student Billing
    Route::get('student_package/{id}', [StudentPackageController::class, 'index'])->name('student.packages.index');
    Route::get('student_packages/{id}', [StudentPackageController::class, 'create'])->name('student.packages.create');
    Route::post('student_package', [StudentPackageController::class, 'store'])->name('student.packages.store');
    Route::put('student_package/{id}', [StudentPackageController::class, 'update'])->name('student.packages.update');

    // Settings
    Route::get('/school_profile', [SchoolProfileController::class, 'create'])->name('school.profile.create');
    Route::post('/school_profile', [SchoolProfileController::class, 'update'])->name('school.profile.update');
    Route::get('/branches', [BranchController::class, 'index'])->name('branch.index');
    Route::get('/branches/showAll', [BranchController::class, 'showAll'])->name('branch.showAll');
    Route::post('/branches', [BranchController::class, 'store'])->name('branch.store');
    Route::get('/branches/{id}', [BranchController::class, 'edit'])->name('branch.edit');
    Route::put('/branches/{id}', [BranchController::class, 'update'])->name('branch.update');

    // Settings for Grades
    Route::get('/grades', [GradeController::class, 'create'])->name('grade.create');
    Route::get('/grades/showAll', [GradeController::class, 'showAll'])->name('grade.showAll');
    Route::post('/grade/store', [GradeController::class, 'store'])->name('grade.store');
    Route::get('/grade/{id}', [GradeController::class, 'edit'])->name('grade.edit');
    Route::put('/grade/{id}', [GradeController::class, 'update'])->name('grade.update');

    // Academic Year
    Route::get('/academic_years', [AcademicYearController::class, 'index'])->name('academic-year');
    Route::get('/academic_years/create', [AcademicYearController::class, 'create'])->name('academic-year.create');
    Route::post('/academic_years/store', [AcademicYearController::class, 'store'])->name('academic-year.store');
    Route::get('/academic_years/{id}', [AcademicYearController::class, 'edit'])->name('academic-year.edit');
    Route::put('/academic_years/{id}', [AcademicYearController::class, 'update'])->name('academic-year.update');
    Route::put('/academic_years/current/{id}', [AcademicYearController::class, 'updateIsCurrent'])->name('academic-year.updateIsCurrent');

    // Fees 
    Route::get('/fees', [FeeController::class, 'index'])->name('fees.index');
    Route::get('/all_fees', [FeeController::class, 'showAll'])->name('fees.showAll');
    Route::post('/fee', [FeeController::class, 'store'])->name('fee.store');
    Route::get('/fee/{id}', [FeeController::class, 'edit'])->name('fee.edit');
    Route::put('/fee/{id}', [FeeController::class, 'update'])->name('fee.update');
    Route::put('/fee_status/{id}', [FeeController::class, 'updateStatus'])->name('fee.update_status');

    Route::get('/getFeesProperties', [FeeController::class, 'getFeesProperties'])->name('fees.properties');
    // Packages
    Route::get('/packages', [PackageController::class, 'index'])->name('packages.index');
    Route::get('/all_packages', [PackageController::class, 'showAll'])->name('packages.showAll');
    Route::get('/packages/create', [PackageController::class, 'create'])->name('package.create');
    Route::post('/packages/store', [PackageController::class, 'store'])->name('package.store');
    Route::get('/packages/{id}', [PackageController::class, 'edit'])->name('package.edit');
    Route::put('/packages/{id}', [PackageController::class, 'update'])->name('package.update');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/showAll', [UserController::class, 'showAll'])->name('users.showAll');
    Route::get('/users/create', [UserController::class, 'create'])->name('user.create');
    Route::post('/users/store', [UserController::class, 'store'])->name('user.store');
    Route::get('/users/{id}', [UserController::class, 'edit'])->name('user.edit');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('user.update');

    Route::get('/positions', [PositionController::class, 'index'])->name('positions.index');
    Route::get('/positions/showAll', [PositionController::class, 'showAll'])->name('positions.showAll');
    Route::post('/positions/store', [PositionController::class, 'store'])->name('position.store');
    Route::get('/positions/edit/{id}', [PositionController::class, 'edit'])->name('position.edit');
    Route::put('/positions/{id}', [PositionController::class, 'update'])->name('position.update');


    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/showAll', [RoleController::class, 'showAll'])->name('roles.showAll');
    Route::post('/roles/store', [RoleController::class, 'store'])->name('roles.store');

    // Integrations & Configurations
    Route::get('integrations', [IntegrationController::class, 'index'])->name('integrations.index');
    Route::get('configurations', [IntegrationConfigurationController::class, 'index'])->name('configurations.index');

    Route::post('integrations/{config}/store', [IntegrationController::class, 'store'])->name('integrations.store');
    Route::put('integrations/{config}/update', [IntegrationController::class, 'update'])->name('integrations.update');

    Route::get('integrations_payroll_items', [IntegrationController::class, 'payrollItems'])->name('integrations.payrollItems');
    Route::post('integrations_payroll_items/store', [IntegrationController::class, 'storePayrollItem'])->name('integrations.payrollItems.store');
    Route::put('integrations_payroll_items/update/{id}', [IntegrationController::class, 'updatePayrollItem'])->name('integrations.payrollItems.update');
});

require __DIR__ . '/auth.php'; // Breeze default routes (uses 'web' guard)