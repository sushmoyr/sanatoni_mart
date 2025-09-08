<?php

namespace Database\Seeders;

use App\Models\ShippingZone;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShippingZoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $zones = [
            [
                'name' => 'Inside Dhaka',
                'description' => 'Dhaka Metropolitan Area including all areas within Dhaka city',
                'areas' => [
                    'dhaka', 'dhanmondi', 'gulshan', 'banani', 'uttara', 'mirpur', 
                    'pallabi', 'mohammadpur', 'old dhaka', 'wari', 'ramna', 
                    'tejgaon', 'savar', 'keraniganj', 'dohar', 'nawabganj'
                ],
                'shipping_cost' => 60.00,
                'is_active' => true,
                'delivery_time_min' => 1,
                'delivery_time_max' => 2,
            ],
            [
                'name' => 'Outside Dhaka',
                'description' => 'All areas outside Dhaka Metropolitan Area',
                'areas' => [
                    'chittagong', 'sylhet', 'rajshahi', 'khulna', 'barishal', 
                    'rangpur', 'mymensingh', 'comilla', 'narayanganj', 
                    'gazipur', 'brahmanbaria', 'feni', 'noakhali', 'lakshmipur',
                    'chandpur', 'baridhara', 'cumilla', 'jessore', 'kushtia',
                    'pabna', 'bogura', 'dinajpur', 'thakurgaon', 'panchagarh',
                    'nilphamari', 'lalmonirhat', 'kurigram', 'gaibandha',
                    'jaypurhat', 'naogaon', 'chapainawabganj', 'natore',
                    'sirajganj', 'manikganj', 'faridpur', 'rajbari', 
                    'madaripur', 'gopalganj', 'shariatpur', 'narsingdi',
                    'kishoreganj', 'netrokona', 'sherpur', 'jamalpur',
                    'tangail', 'munshiganj', 'coxs bazar'
                ],
                'shipping_cost' => 120.00,
                'is_active' => true,
                'delivery_time_min' => 3,
                'delivery_time_max' => 7,
            ],
        ];

        foreach ($zones as $zone) {
            ShippingZone::create($zone);
        }
    }
}
