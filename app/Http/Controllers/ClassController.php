<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassController extends Controller
{
    public function index()
    {
        $classes = Classes::all();
        return Inertia::render('Base/Class/Classes', [
            'classes' => $classes,
        ]);
    }

    public function create()
    {
        return Inertia::render('Base/Class/AddClass');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:classes,code',
        ]);

        Classes::create($request->all());

        return redirect()->route('class.index')->with('success', 'Class created successfully.');
    }

    public function edit($id)
    {
        $class = Classes::findOrFail($id);
        return Inertia::render('Base/Class/EditClass', [
            'class' => $class,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:classes,code,' . $id,
        ]);

        $class = Classes::findOrFail($id);
        $class->update($request->all());

        return redirect()->route('class.index')->with('success', 'Class updated successfully.');
    }
}
