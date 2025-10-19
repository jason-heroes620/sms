<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AcademicYear extends Model
{
    use HasUuids;

    protected $primaryKey = 'academic_year_id';
    protected $table = 'academic_years';

    protected $fillable = [
        'academic_year',
        'start_date',
        'end_date',
        'is_current',
        'created_by'
    ];

    protected $casts = [
        'is_current' => 'boolean'
    ];

    public function classes()
    {
        return $this->hasMany(Classes::class);
    }

    // Set only one year as current
    public static function setCurrent($id)
    {
        self::query()->update(['is_current' => false]);
        $year = self::findOrFail($id);
        $year->is_current = true;
        $year->save();
        return $year;
    }

    public function scopeActive($query)
    {
        return $query->where('is_current', true);
    }
}
