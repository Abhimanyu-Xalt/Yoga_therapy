import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Mock data for therapists
    const therapists = [
      {
        id: '1',
        userId: 'user1',
        specialization: 'Physical Therapy',
        experience: 5,
        qualifications: ['DPT', 'Certified Yoga Instructor'],
        availability: [
          {
            day: 'monday',
            slots: ['09:00', '10:00', '11:00']
          },
          {
            day: 'wednesday',
            slots: ['14:00', '15:00', '16:00']
          }
        ],
        rating: 4.5
      },
      {
        id: '2',
        userId: 'user2',
        specialization: 'Yoga Therapy',
        experience: 8,
        qualifications: ['RYT-500', 'Therapeutic Yoga Specialist'],
        availability: [
          {
            day: 'tuesday',
            slots: ['09:00', '10:00', '11:00']
          },
          {
            day: 'thursday',
            slots: ['14:00', '15:00', '16:00']
          }
        ],
        rating: 4.8
      }
    ];

    // Get query parameters
    const url = new URL(request.url);
    const specialization = url.searchParams.get('specialization');
    const experience = url.searchParams.get('experience');

    // Filter therapists based on query parameters
    let filteredTherapists = therapists;
    if (specialization) {
      filteredTherapists = filteredTherapists.filter(
        t => t.specialization.toLowerCase().includes(specialization.toLowerCase())
      );
    }
    if (experience) {
      filteredTherapists = filteredTherapists.filter(
        t => t.experience >= parseInt(experience)
      );
    }

    return NextResponse.json(filteredTherapists, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 