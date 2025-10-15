<?php

namespace App\Enums;

enum FeeType: string
{
    case MONTLY = 'monthly';
    case ONETIME = 'one_time';
    case SEMESTER = 'semester';
    case ANNUAL = 'annual';
}
