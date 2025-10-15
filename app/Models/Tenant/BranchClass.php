<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class BranchClass extends Model
{
    protected $table = 'branch_class';
    protected $primaryKey = 'branch_class_id';
    protected $fillable = [
        'branch_id',
        'class_id',
        'created_by',
    ];


    public static function getCustomClassesByBranchIds($user)
    {
        return self::select('classes.class_id', 'class_name', 'branches.branch_id', 'branch_name', 'classes.class_id as value', 'classes.class_name as label')
            ->leftJoin('branches', 'branches.branch_id', 'branch_class.branch_id')
            ->leftJoin('classes', 'branch_class.class_id', 'classes.class_id')
            ->leftJoin('academic_years', function ($query) {
                $query->where('is_current', 'true');
                $query->where('classes.academic_year_id', 'academic_year.academic_year_id');
            })->whereIn('branches.branch_id', BranchUser::getUserBranchIds($user))
            ->get();
    }
}
