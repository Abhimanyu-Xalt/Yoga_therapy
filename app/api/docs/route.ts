import { NextResponse } from 'next/server';

const spec = {
  openapi: '3.0.0',
  info: {
    title: 'Yoga Therapy API Documentation',
    version: '1.0.0',
    description: 'API documentation for the Yoga Therapy platform',
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005',
      description: 'Development server',
    },
  ],
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/patients': {
      get: {
        tags: ['Patients'],
        summary: 'Get all patients',
        responses: {
          '200': {
            description: 'List of patients',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Patient' },
                },
              },
            },
          },
        },
      },
    },
    '/api/therapists': {
      get: {
        tags: ['Therapists'],
        summary: 'Get all therapists',
        responses: {
          '200': {
            description: 'List of therapists',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Therapist' },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'patient', 'therapist'] },
        },
      },
      Patient: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          age: { type: 'number' },
          gender: { type: 'string' },
          status: { type: 'string', enum: ['active', 'inactive'] },
        },
      },
      Therapist: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          specialization: { type: 'array', items: { type: 'string' } },
          experience: { type: 'number' },
          status: { type: 'string', enum: ['active', 'inactive'] },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

export async function GET() {
  return NextResponse.json(spec);
} 