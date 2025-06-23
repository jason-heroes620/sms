<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SchoolProfileController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');



    // Student Routes
    Route::get('/students', [StudentController::class, 'index'])->name('student.index');
    Route::get('/student/create', [StudentController::class, 'create'])->name('student.create');
    Route::post('/student/store', [StudentController::class, 'store'])->name('student.store');
    Route::get('/student/{id}', [StudentController::class, 'edit'])->name('student.edit');
    Route::patch('/student/{id}', [StudentController::class, 'update'])->name('student.update');

    // Class Routes
    Route::get('/classes', [ClassController::class, 'index'])->name('class.index');
    Route::get('/class/create', [ClassController::class, 'create'])->name('class.create');
    Route::post('/class/store', [ClassController::class, 'store'])->name('class.store');
    Route::get('/class/{id}', [ClassController::class, 'edit'])->name('class.edit');
    Route::patch('/class/{id}', [ClassController::class, 'update'])->name('class.update');

    // Subject Route
    Route::get('/subjects', [SubjectController::class, 'index'])->name('subject.index');
    Route::get('/subject/create', [SubjectController::class, 'create'])->name('subject.create');
    Route::post('/subject/store', [SubjectController::class, 'store'])->name('subject.store');
    Route::get('/subject/{id}', [SubjectController::class, 'edit'])->name('subject.edit');
    Route::patch('/subject/{id}', [SubjectController::class, 'update'])->name('subject.update');



    // settings
    Route::get('/settings/school_profile', [SchoolProfileController::class, 'create'])->name('school.profile.create');
    Route::post('/settings/school_profile', [SchoolProfileController::class, 'update'])->name('school.profile.update');

    // Academic Year
    Route::get('/settings/academic_years', [AcademicYearController::class, 'index'])->name('academic-year');
    Route::get('/settings/academic_year/create', [AcademicYearController::class, 'create'])->name('academic-year.create');
    Route::post('/settings/academic_year/store', [AcademicYearController::class, 'store'])->name('academic-year.store');
    Route::get('/settings/academic_year/{id}', [AcademicYearController::class, 'edit'])->name('academic-year.edit');
    Route::patch('/settings/academic_year/{id}', [AcademicYearController::class, 'update'])->name('academic-year.update');
});

require __DIR__ . '/auth.php';
