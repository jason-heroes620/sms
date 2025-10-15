<?php

namespace App\Rules;

use App\Models\Tenant\BranchClass;
use App\Models\Tenant\Classes;
use App\Models\Tenant\Sections;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UniqueSectionClassInBranch implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */

    protected $classId;
    protected ?string $ignoreId;


    public function __construct($classId, ?string $ignoreId = null)
    {
        $this->classId = $classId;
        $this->ignoreId = $ignoreId;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $query = Sections::leftJoin('classes', 'sections.class_id', 'classes.class_id')
            ->where('sections.class_id', $this->classId)
            ->where('section_name', $value);

        if ($this->ignoreId) {
            $query->where('sections.section_id', '!=', $this->ignoreId);
        }

        if ($query->exists()) {
            $fail('The :attribute must be unique within this branch.');
        }
    }
}
