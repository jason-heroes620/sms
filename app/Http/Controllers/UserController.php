<?php

namespace App\Http\Controllers;

use App\Models\Tenant\Branches;
use App\Models\Tenant\BranchUser;
use App\Models\Tenant\Positions;
use App\Models\Tenant\Roles;
use App\Models\Tenant\User;
use App\Models\Tenant\UserProfiles;
use App\Services\JibbleService;
use App\Services\PayrollService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;


class UserController extends Controller
{
    protected $payrollService, $jibbleService;

    public function __construct(PayrollService $payrollService, JibbleService $jibbleService)
    {
        $this->payrollService = $payrollService;
        $this->jibbleService = $jibbleService;
    }

    public function index()
    {
        // $employees = $this->payrollService->getEmployees();
        // Log::info('payroll employee');
        // Log::info($employees);
        return Inertia::render('Settings/User/Users');
    }

    public function showAll(Request $request)
    {
        $query = UserProfiles::select('user_id', DB::raw("concat(last_name, ' ', first_name) as name"));

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

        foreach ($users->items() as &$user) {
            $roles = BranchUser::select(DB::raw("concat(branch_name, ' - ', roles.name) as role_name"))
                ->leftJoin('roles', 'roles.id', 'branch_user.role_id')
                ->leftJoin('branches', 'branch_user.branch_id', 'branches.branch_id')
                ->where('branch_user.user_id', $user['user_id'])
                ->get()->toArray();

            $branches = Branches::select('branch_id', 'branch_name')
                ->where('branch_status', 'active')
                ->whereIn('branch_id', $this->getUserBranchIds($user['user_id']))
                ->get()->toArray();
            $user['roles'] = $roles ? implode(', ', array_column($roles, 'role_name')) : '';
            // $user['roles'] = $roles;
            $user['branch'] = $branches ? implode(',', array_column($branches, 'branch_name')) : '';
        }
        unset($user);

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
        $user = Auth::id();
        $branches = Branches::select('branch_id as value', 'branch_name as label')->where('branch_status', 'active')->orderBy('branch_name')->get();
        $roles = Roles::select('id', 'name')->orderBy('name')->get();
        $positions = Positions::select('position_id', 'position')->orderBy('position')->get();
        return Inertia::render('Settings/User/AddUser', compact('roles', 'branches', 'positions'));
    }

    public function store(Request $request)
    {
        $creator = Auth::id();
        try {
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
                'email' => 'required|email|max:150',
                'dob' => 'required|date',
                'address.address1' => 'required|string|max:100',
                'address.address2' => 'nullable|string|max:100',
                'address.address3' => 'nullable|string|max:100',
                'address.city' => 'nullable|string|max:100',
                'address.postcode' => 'nullable|string|max:10',
                'address.state' => 'nullable|string|max:50',
                'address.country' => 'nullable|string|max:50',
                'contact_no' => 'required|string|max:20',
                'marital_status' => 'required|string',
                'residential_status' => 'required|string',
                'gender' => 'required|string',
                'race' => 'required|string',
                'role_info' => 'required|array',
                'role_info.*.branch_id' => 'required|array',
                'role_info.*.role_id' => 'required|string',
                'role_info.*.id' => 'required|string',
                'position_id' => 'required|string',
                'branch_id' => 'required|string',
                'employment_date' => 'required|date',
            ]);

            if ($validator->fails()) {
                return redirect()
                    ->back()
                    ->withErrors($validator)
                    ->withInput();
            }

            DB::beginTransaction();

            $user = User::create([
                'name' => $request->last_name . ' ' . $request->first_name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'user_status' => 'active',
            ]);

            $userProfile = UserProfiles::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'dob' => $request->dob,
                'contact_no' => $request->contact_no,
                'address' => $request->address,
                'gender' => $request->gender,
                'race' => $request->race,
                'residential_status' => $request->residential_status,
                'marital_status' => $request->marital_status,
                'nic' => $request->nic,
                'passport' => $request->passport,
                'email' => $request->email,
                'user_status' => $request->user_status,
                'user_id' => $user->id,
                'position_id' => $request->position_id,
                'employment_date' => $request->employment_date,
            ]);

            foreach ($request->role_info as $role) {
                foreach ($role['branch_id'] as $branch) {
                    BranchUser::create([
                        'user_id' => $user->id,
                        'branch_id' => $branch,
                        'role_id' => $role['id'],
                        'created_by' => $creator
                    ]);
                }
            }

            $response = $this->payrollService->createEmployee($this->convertPayrollEmployee(($request)));
            if ($response->getStatusCode() == 201 || $response->getStatusCode() == 200) {
                Log::info('response successful');
                $data = json_decode($response->getBody()->getContents(), true);
                $userProfile->update([
                    'payroll_employee_id' => $data['id'], // Store the API's ID
                ]);

                $jibbleResponse = $this->jibbleService->createMember($this->convertJibbleMember($request, $data['id']));
                if ($jibbleResponse->getStatusCode() == 201 || $response->getStatusCode() == 200) {
                    Log::info('response successful');

                    DB::commit();
                    return redirect()->back()->with('success', 'User created successfully.');
                } else {
                    // Log the error for monitoring
                    DB::rollBack();
                    Log::warning("API failed for employee {$userProfile->payroll_position_id}. Status: {$response->status()}");
                    return redirect()->back()->with('error', 'Error creating user');
                }
            } else {
                // Log the error for monitoring
                DB::rollBack();
                Log::warning("API failed for employee {$userProfile->payroll_position_id}. Status: {$response->status()}");
                return redirect()->back()->with('error', 'Error creating user');
            }
        } catch (Exception $e) {
            Log::error($e);
            DB::rollBack();
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function edit(Request $request) {}

    public function update(Request $request) {}

    public function getUserBranchIds($userId)
    {
        $user = User::find($userId);
        if ($user) {
            return $user->branches()->pluck('branches.branch_id');
        }
        return collect(); // Return empty collection if user not found
    }

    private function convertPayrollEmployee($employee)
    {
        $payrollPosition = Positions::select('payroll_position_id', 'position')->where('position_id', $employee->position_id)->first();
        $payrollLocation = Branches::select('payroll_location_id')->where('branch_id', $employee->branch_id)->first();
        $data = [
            'name' => $employee->last_name . ' ' . $employee->first_name,
            'nationality' => $employee->address['country'],
            'isResident' => $employee->residential_status === 'resident' ? true : false,
            'personalIdType' => $employee->residential_status === 'resident' ? 'NRIC' : 'Passport',
            'personalIdNumber' => $employee->residential_status === 'resident' ? preg_replace('/^(\d{6})(\d{2})(\d{2})/', '$1-$2-$3', $employee->nic) : $employee->passport,
            'dateOfBirth' => $employee->dob,
            'isPermanentResident' => $employee->residential_status === 'resident' ? false : true,
            'race' => ucfirst($employee->race),
            'gender' => $employee->gender === 'male' ? 'Male' : 'Female',
            'maritalStatus' => ucfirst($employee->marital_status),
            'email' => $employee->email,
            'address' => [
                'addressLine1' => $employee->address['address1'],
                'addressLine2' => $employee->address['address2'],
                'addressLine3' => $employee->address['address3'],
                'city' => $employee->address['city'],
                'postcode' => $employee->address['postcode'],
                'state' => $employee->address['state'],
            ],
            'positionId' => $payrollPosition->payroll_position_id,
            'positionName' => $payrollPosition->position,
            'locationId' => $payrollLocation->payroll_location_id,
            'startDate' => $employee->employment_date,
        ];

        if ($employee->marital_status === 'married') {
            $data['spouseInfo'] = [
                'isSpouseEmployed' => $employee->spouse_info['employment_status'],
                'isSpouseDisabled' => $employee->spouse_info['ability_status'],
            ];
        }
        Log::info($data);
        return $data;
    }

    private function convertJibbleMember($member, $id)
    {
        $data = [
            'id' => $id,
            'fullName' => $member->last_name . ' ' . $member->first_name,
            'email' => $member->email,
            "IPersonSetting/SendInviteEmail" => false
        ];

        return $data;
    }
}
