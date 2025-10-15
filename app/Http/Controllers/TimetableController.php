<?php

namespace App\Http\Controllers;

use App\Models\Tenant\AcademicYear;
use App\Models\Tenant\AcademicYearClass;
use App\Models\Tenant\BranchClass;
use App\Models\Tenant\Branches;
use App\Models\Tenant\Classes;
use App\Models\Tenant\Sections;
use App\Models\Tenant\Subjects;
use App\Models\Tenant\Timetables;
use App\Models\Tenant\TimetableDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TimetableController extends Controller
{
    protected $branchUser, $branches;

    public function __construct(UserController $branchUser)
    {
        $user = Auth::id();
        $this->branchUser = $branchUser;
        $this->branches = Branches::select('branch_id', 'branch_name')
            ->where('branch_status', 'active')
            ->whereIn('branch_id', $this->branchUser->getUserBranchIds($user))
            ->get();;
    }

    public function create(Request $request)
    {
        $user = Auth::id();
        $academic_years = AcademicYear::where('end_date', '>=', now())->get();
        $branches = $this->branches;
        $classes = BranchClass::getCustomClassesByBranchIds($user);
        foreach ($classes as $class) {
            $class['section'] = Sections::select('section_id', 'section_name', DB::raw("concat(last_name, ' ', first_name) as name"))
                ->leftJoin('user_profiles', 'user_profiles.user_id', 'sections.teacher_in_charge')
                ->where('class_id', $class['class_id'])
                ->get();
        }
        $subjects = Subjects::select('subject_id', 'subject_name')
            ->where('subject_status', 'active')
            ->orderBy('subject_name')
            ->get();


        return Inertia::render(
            'Base/Timetables/AddClassSchedule',
            compact(
                'academic_years',
                'branches',
                'classes',
                'subjects',
            )
        );
    }

    public function store(Request $request)
    {
        $user = Auth::id();
        // $request->validate([
        //     'start_time' => 'required|time',
        //     'end_time' => 'required|time|after_or_equal:start_time',
        // ]);

        /// *** check for class with overlapping schedules before storing

        $timetable = Timetables::create([
            'academic_year_id' => $request->input('academic_year_id'),
            'branch_id' => $request->input('branch_id'),
            'created_by' => $user,
        ]);
        $recurrence = $request->input('recurrence');
        // dd(json_encode($recurrence['days']));
        TimetableDetails::create(
            [
                'timetable_id' => $timetable->timetable_id,
                'class_id' => $request->input('class_id'),
                'section_id' => $request->input('section_id'),
                'subject_id' => $request->input('subject_id'),
                'recurrence' => $recurrence['pattern'],
                'days' => json_encode($recurrence['days']),
                'start_time' => $recurrence['start_time'],
                'end_time' => $recurrence['end_time'],
                'color' => $request->input('color'),
                'created_by' => $user,
            ]
        );

        return redirect()->back()->with('success');
    }

    public function view(Request $request)
    {
        $events = Timetables::leftJoin('timetable_details', 'timetable_details.timetable_id', 'timetables.timetable_id')
            ->leftJoin('classes', 'timetable_details.class_id', 'classes.class_id')
            ->leftJoin('sections', 'timetable_details.section_id', 'sections.section_id')
            ->leftJoin('subjects', 'timetable_details.subject_id', 'subjects.subject_id')
            ->leftJoin('academic_years', 'academic_years.academic_year_id', 'timetables.academic_year_id')
            ->get()->toArray();

        foreach ($events as &$event) {
            $event['title'] = $event['subject_name'] . " - " . $event['class_name'] . " (" . $event['section_name'] . ")";
            $event['daysOfWeek'] = json_decode($event['days']);
            $event['allDay'] = false;
            $event['startTime'] = $event['start_time'];
            $event['endTime'] = $event['end_time'];
            $event['startRecur'] = $event['start_date'];
            $event['endRecur'] = $event['end_date'];
            $event['color'] = $event['color'];
        }
        unset($student);

        $holidayEvent = [
            [
                'title' => 'Public Holiday',
                'start' => '2025-09-15',
                'allDay' => true,

            ],
            [
                'title' => 'Public Holiday',
                'start' => '2025-09-16',
                'allDay' => true,

            ]
        ];
        $mergeEvents = array_merge($events, $holidayEvent);
        $holidays = ['2025-09-15', '2025-09-16'];

        return Inertia::render('Base/Timetables/Timetables', [
            'events' => collect($mergeEvents),
            'holidays' => $holidays,
        ]);
    }
}
