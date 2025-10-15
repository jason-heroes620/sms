<?php

namespace App\Rules;

use App\Models\Tenant\BranchClass;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UniqueClassInBranch implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */

    protected $branchId;
    protected ?string $ignoreId;


    public function __construct($branchId, ?string $ignoreId = null)
    {
        $this->branchId = $branchId;
        $this->ignoreId = $ignoreId;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $query = BranchClass::leftJoin('classes', 'branch_class.class_id', 'classes.class_id')
            ->where('class_name', $value)
            ->where('branch_id', $this->branchId);

        if ($this->ignoreId) {
            $query->where('branch_class.class_id', '!=', $this->ignoreId);
        }

        if ($query->exists()) {
            $fail('The :attribute must be unique within this branch.');
        }
    }
}
