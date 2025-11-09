<?php

namespace App\Http\Controllers;

use App\Models\Tenant\BranchClass;
use App\Models\Tenant\Classes;
use App\Models\Tenant\ClassStudent;
use App\Models\Tenant\Guardians;
use App\Models\Tenant\GuardianStudent;
use App\Models\Tenant\Sections;
use App\Models\Tenant\StudentAttendance;
use App\Models\Tenant\StudentDetails;
use App\Models\Tenant\Students;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class StudentController extends Controller
{
    protected $relationships;

    public function __construct(SettingRelationshipController $relationships)
    {
        $this->relationships = $relationships;
    }

    public function index(Request $request)
    {
        $user = Auth::id();
        // $classes = Classes::select('class_id as id', 'class_name as value')->get()->toArray();
        $branchClass = BranchClass::getCustomClassesByBranchIds($user)->toArray();
        $classes = array_map(function ($item) {
            return [
                'id' => $item['class_id'],
                'value' => $item['class_name']
            ];
        }, $branchClass);
        Log::info($classes);
        array_unshift($classes, ['id' => ' ', 'value' => 'All Classes']);
        return Inertia::render('Base/Student/Students', compact('classes'));
    }

    public function showAll(Request $request)
    {
        $query = Students::select(['students.student_id', DB::raw("concat(last_name, ' ', first_name) as student_name"), 'last_name', 'first_name', 'gender', 'class_name', 'section_name', 'classes.class_id'])
            ->leftJoin('class_student', function ($query) {
                $query->on('class_student.student_id', 'students.student_id');
                $query->where('class_student_status', 'active');
            })
            ->leftJoin('classes', 'class_student.class_id', 'classes.class_id')
            ->leftJoin('sections', 'sections.section_id', 'class_student.section_id');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('last_name', 'like', '%' . $search . '%');
            $query->orWhere('first_name', 'like', '%' . $search . '%');
            $query->orWhere('class_name', 'like', '%' . $search . '%');
        }

        if ($request->has('filters')) {
            foreach ($request->filters as $column => $value) {
                if ($value !== null) {
                    $query->where('classes.class_id', $value);
                }
            }
        }

        if ($request->has('sort')) {
            $query->orderBy($request->sort['field'], $request->sort['direction']);
        } else {
            $query->orderBy('student_name', 'asc');
        }

        $perPage = $request->per_page ?? 10;
        $students = $query->paginate($perPage);

        foreach ($students->items() as &$student) {
            $attendance = StudentAttendance::where('student_id', $student['student_id'])
                ->whereDate('created_at', Carbon::today())
                ->first();
            if ($attendance)
                $student['attendance'] = $attendance['attendance'];
        }
        unset($student);

        return response()->json([
            'data' => $students->items(),
            'meta' => [
                'current_page' => $students->currentPage(),
                'last_page' => $students->lastPage(),
                'per_page' => $students->perPage(),
                'total' => $students->total(),
                'from' => $students->firstItem(),
                'to' => $students->lastItem(),
            ],
        ]);
    }

    public function create()
    {
        $user = Auth::id();
        $relationships = $this->relationships->getRelationships();
        $classes = BranchClass::getCustomClassesByBranchIds($user);
        foreach ($classes as $class) {
            $class['section'] = Sections::select('section_id', 'section_name', DB::raw("concat(last_name, ' ', first_name) as name"))
                ->leftJoin('user_profiles', 'user_profiles.user_id', 'sections.teacher_in_charge')
                ->where('class_id', $class['class_id'])
                ->get();
        }

        return Inertia::render('Base/Student/AddStudent', compact('relationships', 'classes'));
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:150',
                'last_name' => 'required|string|max:150',
                'gender' => 'required|string',
                'dob' => 'required|date',
                'registration_no' => 'required|string|max:30',
                'admission_date' => 'required|date',
                'nic' => 'required|string|max:16',
                'religion' => 'required|string|max:20',
                'race' => 'required|string|max:20',
                'parents' => 'required|array',
                'parents.*.first_name' => 'required|string|max:100',
                'parents.*.last_name' => 'required|string|max:100',
                'parents.*.contact_no' => 'required|string|max:20',
                'parents.*.email' => 'required|email|max:150',
                'parents.*.occupation' => 'required|string|max:100',
                'parents.*.relationship' => 'required|string|max:50',
            ]);
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }

            DB::beginTransaction();
            $student = Students::create($request->all());

            StudentDetails::create(
                [
                    'student_id' => $student->student_id,
                    'allergy' => $request->input('allergy'),
                    'disease' => $request->input('disease'),
                    'additional_notes' => $request->input('additional_notes')
                ]
            );

            if ($request->input('parents')) {
                foreach ($request->input('parents') as $p) {
                    $guardian = Guardians::create(
                        [
                            'first_name' => $p['first_name'],
                            'last_name' => $p['last_name'],
                            'contact_no' => $p['contact_no'],
                            'email' => $p['email'],
                            'occupation' => $p['occupation'],
                        ]
                    );

                    GuardianStudent::create([
                        'guardian_id' => $guardian->guardian_id,
                        'student_id' => $student->student_id,
                        'relationship' => $p['relationship']
                    ]);
                }
            }

            ClassStudent::updateOrCreate(
                [
                    'student_id' => $student->student_id,
                ],
                [
                    'class_id'   => $request->input('class_id'),
                    'section_id' => $request->input('section_id')
                ]
            );

            DB::commit();

            return redirect()->route('students.index')->with('success', 'Student created successfully.');
        } catch (Exceptions $e) {
            Log::error("Error adding student.");
            Log::error($e);
            DB::rollBack();

            return redirect()->back()->with('error', 'Error adding student. Please check your entry and try again.');
        }
    }

    public function edit($id)
    {
        $student = Students::select([
            'students.student_id',
            'last_name',
            'first_name',
            'dob',
            'gender',
            'registration_no',
            'admission_date',
            'nic',
            'religion',
            'race',
            'allergy',
            'disease',
            'additional_notes'
        ])
            ->leftJoin('student_details', 'students.student_id', 'student_details.student_id')
            ->where('students.student_id', $id)
            ->first();

        $user = Auth::id();
        $classes = BranchClass::getCustomClassesByBranchIds($user);
        foreach ($classes as $class) {
            $class['section'] = Sections::select('section_id', 'section_name', DB::raw("concat(last_name, ' ', first_name) as name"))
                ->leftJoin('user_profiles', 'user_profiles.user_id', 'sections.teacher_in_charge')
                ->where('class_id', $class['class_id'])
                ->get();
        }
        $class_student = ClassStudent::select('class_id', 'section_id')
            ->where('student_id', $student->student_id)
            ->where('class_student_status', 'active')
            ->first();
        $student['class_id'] = $class_student->class_id;
        $student['section_id'] = $class_student->section_id;

        $relationships = $this->relationships->getRelationships();
        $guardians = GuardianStudent::leftJoin('guardians', 'guardians.guardian_id', 'guardian_student.guardian_id')
            ->where('student_id', $student->student_id)->get();

        return Inertia::render('Base/Student/EditStudent', [
            'student' => $student,
            'relationships' => $relationships,
            'existingParents' => $guardians,
            'classes' => $classes
        ]);
    }

    public function update(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:150',
                'last_name' => 'required|string|max:150',
                'gender' => 'required|string',
                'dob' => 'required|date',
                'registration_no' => 'required|string|max:30',
                'admission_date' => 'required|date',
                'nic' => 'required|string|max:16',
                'religion' => 'required|string|max:20',
                'race' => 'required|string|max:20',
                'parents' => 'required|array',
                'parents.*.first_name' => 'required|string|max:100',
                'parents.*.last_name' => 'required|string|max:100',
                'parents.*.contact_no' => 'required|string|max:20',
                'parents.*.email' => 'required|email:rfc,dns|max:150',
                'parents.*.occupation' => 'required|string|max:100',
                'parents.*.relationship' => 'required|string|max:50',
            ]);
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }

            Students::where('student_id', $request->id)
                ->update([
                    'first_name' => $request->input('first_name'),
                    'last_name' => $request->input('last_name'),
                    'gender' => $request->input('gender'),
                    'dob' => $request->input('dob'),
                    'registration_no' => $request->input('registration_no'),
                    'admission_date' => $request->input('admission_date'),
                    'nic' => $request->input('nic'),
                    'religion' => $request->input('religion'),
                    'race' => $request->input('race'),
                ]);

            StudentDetails::updateOrCreate(
                ['student_id' => $request->id],
                [
                    'allergy' => $request->input('allergy'),
                    'disease' => $request->input('disease'),
                    'additional_notes' => $request->input('additional_notes')
                ]
            );

            $submittedIds = collect($request->input('parents'))->pluck('guardian_id')->filter()->all();
            $existingIds = Guardians::select('guardians.guardian_id')
                ->leftJoin('guardian_student', 'guardians.guardian_id', 'guardian_student.guardian_id')
                ->where('student_id', $request->id)->pluck('guardian_id')->all();

            $idsToDelete = array_diff($existingIds, $submittedIds);

            // 4. Perform the deletion in a single query
            if (!empty($idsToDelete)) {
                Guardians::destroy($idsToDelete);
                GuardianStudent::whereIn('guardian_id', $idsToDelete)->delete();
            }

            if ($request->input('parents')) {
                foreach ($request->input('parents') as $p) {
                    if (!in_array($p['guardian_id'], $idsToDelete)) {
                        Guardians::updateOrCreate(
                            [
                                'guardian_id' => $p['guardian_id']
                            ],
                            [
                                'first_name' => $p['first_name'],
                                'last_name'  => $p['last_name'],
                                'contact_no' => $p['contact_no'],
                                'email'      => $p['email'],
                                'occupation' => $p['occupation'],
                            ]
                        );

                        GuardianStudent::updateOrCreate(
                            [
                                'student_id'  => $request->id,
                                'guardian_id' => $p['guardian_id']
                            ],
                            [
                                'relationship' => $p['relationship']
                            ]
                        );
                    }
                }
            }

            ClassStudent::updateOrCreate(
                [
                    'student_id' => $request->id,
                ],
                [
                    'class_id'   => $request->input('class_id'),
                    'section_id' => $request->input('section_id')
                ]
            );

            return redirect()->back()->with('success', 'Student created successfully.');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Error adding student. Please check your entry and try again.');
        }
    }

    public function attendance()
    {
        $user = Auth::id();
        $classes = BranchClass::getCustomClassesByBranchIdsFilter($user)->toArray();
        array_unshift($classes, ['id' => ' ', 'value' => 'All Classes']);

        return Inertia::render('Base/Student/Attendance', compact('classes'));
    }

    public function getStudentAttendance(Request $request)
    {
        $query = Students::select(['students.student_id', DB::raw("concat(last_name, ' ', first_name) as student_name"), 'last_name', 'first_name', 'gender', 'class_name', 'section_name', 'classes.class_id'])
            ->leftJoin('class_student', function ($query) {
                $query->on('class_student.student_id', 'students.student_id');
                $query->where('class_student_status', 'active');
            })
            ->leftJoin('classes', 'class_student.class_id', 'classes.class_id')
            ->leftJoin('sections', 'sections.section_id', 'class_student.section_id')
            ->leftJoin(
                'academic_years',
                function ($query) {
                    $query->where('is_current', 'true');
                    $query->where('classes.academic_year_id', 'academic_year.academic_year_id');
                }
            );
        // ->where('student_attendance.attendance_date', $request->date ?? Carbon::today());

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('last_name', 'like', '%' . $search . '%');
            $query->orWhere('first_name', 'like', '%' . $search . '%');
            $query->orWhere('class_name', 'like', '%' . $search . '%');
        }

        if ($request->has('filters')) {
            foreach ($request->filters as $column => $value) {
                if ($value !== null) {
                    $query->where('classes.class_id', $value);
                }
            }
        }

        if ($request->has('sort')) {
            $query->orderBy($request->sort['field'], $request->sort['direction']);
        } else {
            $query->orderBy('student_name', 'asc');
        }

        $perPage = $request->per_page ?? 10;
        $students = $query->paginate($perPage);

        foreach ($students->items() as &$student) {
            $attendance = StudentAttendance::where('student_id', $student['student_id'])
                ->whereDate('attendance_date', Carbon::today())
                ->first();
            if ($attendance) {
                $student['status'] = $attendance['status'];
                $student['check_in_time'] = $attendance['check_in_time'];
                $student['check_out_time'] = $attendance['check_out_time'];
            }
        }
        unset($student);

        return response()->json([
            'data' => $students->items(),
            'meta' => [
                'current_page' => $students->currentPage(),
                'last_page' => $students->lastPage(),
                'per_page' => $students->perPage(),
                'total' => $students->total(),
                'from' => $students->firstItem(),
                'to' => $students->lastItem(),
            ],
        ]);
    }
    public function getStudentByClass(Request $request)
    {
        $query = ClassStudent::select(['class_student.class_student_id', 'students.student_id as id', DB::raw("concat(students.last_name, ' ', students.first_name) as name")])
            ->leftJoin('students', function ($join) use ($request) {
                $join->on('class_student.student_id', 'students.student_id')
                    ->where('class_student.class_id', $request->id);
            });

        if ($request->has('search')) {
            $query->where('last_name', 'like', '%' . $request->search . '%')
                ->orWhere('first_name', 'like', '%' . $request->search . '%');
        }

        $student = $query->where('class_student.class_id', $request->id)
            ->get();

        return response()->json($student);
    }
}


// {"first_name":"Roger","last_name":"Federer","dob":"2020-02-01","gender":"M","nic":"11223344","registration_no":"AB123456","profile_picture":"","religion":"other","race":"other","allergy":"test","disease":"test","address1":"","address2":"","address3":"","additional_notes":"test","admission_date":"2025-01-06","parents":[{"id":"11edf46c-8322-491f-a40f-13f185fd7eca","parent_last_name":"","parent_first_name":"","parent_contact_no":"","parent_email":"","parent_occupation":"","relationship":""}]}