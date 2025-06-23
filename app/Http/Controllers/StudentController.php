<?php

namespace App\Http\Controllers;

use App\Models\Students;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Base/Student/Students', [
            'students' => Students::all(),
        ]);
    }
    public function create()
    {
        return Inertia::render('Base/Student/AddStudent');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'class_id' => 'required|exists:classes,id',
        ]);

        Students::create($request->all());

        return redirect()->route('student.index')->with('success', 'Student created successfully.');
    }

    public function edit($id)
    {
        $student = Students::findOrFail($id);
        return Inertia::render('Base/Student/EditStudent', [
            'student' => $student,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email,' . $id,
            'class_id' => 'required|exists:classes,id',
        ]);

        $student = Students::findOrFail($id);
        $student->update($request->all());

        return redirect()->route('student.index')->with('success', 'Student updated successfully.');
    }
}
