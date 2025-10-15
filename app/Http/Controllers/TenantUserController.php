<?php

namespace App\Http\Controllers;

use App\Models\Tenant\Roles;
use Illuminate\Http\Request;
use App\Models\Tenant\User;
use App\Models\Tenant\UserProfiles;
use Exception;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class TenantUserController extends Controller
{
    public function index()
    {
        $users = UserProfiles::where('user_status', 'active')
            ->orderBy('last_name')
            ->get();

        return Inertia::render('Base/User/Users', [
            'users' => $users,
        ]);
    }

    public function showAll(Request $request)
    {
        $query = User::select(['user_profile_id', 'last_name', 'first_name', 'roles.name'])
            ->leftJoin('user_profiles', 'user_profiles.user_id', 'users.id')
            ->leftJoin('roles', 'roles.id', 'user_profiles.role_id')
            ->where('user_profiles.user_status', 'active');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('last_name', 'like', '%' . $search . '%');
            $query->orWhere('first_name', 'like', '%' . $search . '%');
        }

        if ($request->has('filters')) {
            foreach ($request->filters as $column => $value) {
                if ($value !== null) {
                    $query->where('user_profiles.user_status', $value);
                }
            }
        }

        if ($request->has('sort')) {
            $query->orderBy($request->sort['field'], $request->sort['direction']);
        } else {
            $query->orderBy('user_profiles.last_name', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $users = $query->paginate($perPage);

        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem(),
            ],
        ]);
    }

    public function create()
    {
        $roles = Roles::select('id', 'name')->get();
        return Inertia::render('Base/User/AddUser', compact('roles'));
    }

    public function store(Request $request)
    {
        $user = User::query()->create($request->validated());

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(Request $request)
    {
        $roles = Roles::select('id', 'name')->get();
        $user = UserProfiles::where('user_profile_id', $request->id)->first();

        return Inertia::render('Base/User/EditUser', compact('user', 'roles'));
    }

    public function update(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'last_name' => 'required|string|min:3|max:100',
                'first_name' => 'required|string|min:3|max:100',
                'gender' => 'required|string',
                'race' => 'required|string',
                'contact_no' => 'required|string|max:16',
                'email' => 'required|email:rfc,dns|max:150',
                'address.address1' => 'required|string|max:100',
                'address.address2' => 'nullable|string|max:100',
                'address.address3' => 'nullable|string|max:100',
                'address.city' => 'required|string|max:100',
                'address.postcode' => 'required|string|max:10',
                'address.state' => 'required|string|max:50',
                'address.country' => 'required|string|max:50',
                'profile_picture' => 'nullable|image|max:2048',
                'residential_status' => 'required|string',
                'nic' => 'required|string|max:16',
                'passport' => 'nullable|string|max:20',
                'dob' => 'required|date',
                'marital_status' => 'required|string',
                'role_id' => 'required|integer',
                'user_status' => 'required|string',
            ]);
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }
            // dd($request->all());
            UserProfiles::where('user_profile_id', $request->id)->update(
                [
                    'last_name' => $request->input('last_name'),
                    'first_name' => $request->input('first_name'),
                    'gender' => $request->input('gender'),
                    'race' => $request->input('race'),
                    'contact_no' => $request->input('contact_no'),
                    'email' => $request->input('email'),
                    'address' => $request->input('address'),
                    'profile_picture' => $request->input('profile_picture') ?? null,
                    'residential_status' => $request->input('residential_status'),
                    'nic' => $request->input('nic'),
                    'passport' => $request->input('passport'),
                    'dob' => $request->input('dob'),
                    'marital_status' => $request->input('marital_status'),
                    'role_id' => $request->input('role_id'),
                    'user_status' => $request->input('user_status'),
                ]
            );

            return redirect()->back()->with('success', 'User updated successfully.');
        } catch (Exception $e) {

            Log::error("Error updating user profile");
            Log::error($e);

            return redirect()->back()->with('error', 'Error updating user profile.');
        }
    }
}
