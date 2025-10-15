<?php

namespace App\Http\Controllers;

use App\Models\Tenant\SchoolProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Exceptions;
use Inertia\Inertia;
use Symfony\Component\Uid\UuidV8;

class SchoolProfileController extends Controller
{
    public function create()
    {
        $profile = SchoolProfile::first();
        return Inertia::render('Settings/SchoolProfile/SchoolProfile', [
            'profile' => $profile,
        ]);
    }

    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'school_name' => 'required|string|max:150',
                'school_address.address1' => 'required|string|max:100',
                'school_address.address2' => 'nullable|string|max:100',
                'school_address.address3' => 'nullable|string|max:100',
                'school_address.city' => 'nullable|string|max:100',
                'school_address.postcode' => 'nullable|string|max:10',
                'school_address.state' => 'nullable|string|max:50',
                'school_address.country' => 'nullable|string|max:50',
                'school_contactNo' => 'required|string|max:20',
                'school_email' => 'required|email|max:150',
                'school_logo' => 'nullable|image|max:2048',
            ]);

            $profile = SchoolProfile::first();
            // if ($request->hasFile('school_logo')) {
            //     $logoPath = $request->file('school_logo')->store('school_logos', 'public');
            //     $request->merge(['logo' => $logoPath]);
            // }
            $uid = $profile ? $profile->school_profile_id : UuidV8::v4();

            SchoolProfile::updateOrCreate(
                ['school_profile_id' => $uid], // Assuming there's only one profile
                [
                    'school_name' => $validated['school_name'],
                    'school_contact_no' => $validated['school_nontact_no'],
                    'school_email' => $validated['school_email'],
                    'school_address' => $validated['school_address'],
                    'school_profile_id' => $uid
                ]
            );

            return response()->json(['success', 'School profile created successfully.']);
        } catch (Exceptions $e) {
            return response()->json(['error', 'Failed to update school profile: ' . $e]);
        }
    }
}
