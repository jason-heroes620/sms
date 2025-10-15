<?php

namespace App\Http\Controllers;

use App\Models\Tenant\Roles;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/User/Roles');
    }

    public function showAll(Request $request)
    {
        $query = Roles::select(['id', 'name', 'role_status', 'created_by'])
            ->where('role_status', 'active');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', '%' . $search . '%');
        }

        if ($request->has('filters')) {
            foreach ($request->filters as $column => $value) {
                if ($value !== null) {
                    $query->where('role_status', $value);
                }
            }
        }

        if ($request->has('sort')) {
            $query->orderBy($request->sort['field'], $request->sort['direction']);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $roles = $query->paginate($perPage);

        return response()->json([
            'data' => $roles->items(),
            'meta' => [
                'current_page' => $roles->currentPage(),
                'last_page' => $roles->lastPage(),
                'per_page' => $roles->perPage(),
                'total' => $roles->total(),
                'from' => $roles->firstItem(),
                'to' => $roles->lastItem(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        try {
            $user = Auth::getUser();
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:150|unique:roles,name',
            ]);

            if ($validator->fails()) {
                return redirect()
                    ->back()
                    ->withErrors($validator)
                    ->withInput();
            }

            Roles::create([
                'name' => $request->input('name'),
                'guard_name' => 'web',
                'created_by' => $user->name,
                'role_status' => 'active',
            ]);

            return redirect()->back()->with('success', 'Role created successfully.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while creating the role: ' . $e->getMessage());
        }
    }
}
