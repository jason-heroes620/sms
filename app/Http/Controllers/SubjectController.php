<?php

namespace App\Http\Controllers;

use App\Models\Subjects;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subjects::all();
        return Inertia::render('Base/Subject/Subjects', [
            'subjects' => $subjects,
        ]);
    }

    public function create()
    {
        return Inertia::render('Base/Subject/AddSubject');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:subjects,code',
        ]);

        Subjects::create($request->all());

        return redirect()->route('subject.index')->with('success', 'Subject created successfully.');
    }

    public function edit($id)
    {
        $subject = Subjects::findOrFail($id);
        return Inertia::render('Base/Subject/EditSubject', [
            'subject' => $subject,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:subjects,code,' . $id,
        ]);

        $subject = Subjects::findOrFail($id);
        $subject->update($request->all());

        return redirect()->route('subject.index')->with('success', 'Subject updated successfully.');
    }
}
