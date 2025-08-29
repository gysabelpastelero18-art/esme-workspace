import { NextRequest, NextResponse } from 'next/server';
import { saveProductionRecord, loadProductionRecord, deleteProductionRecord } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, branch, department, data } = body;

    if (!date || !branch || !department || !data) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await saveProductionRecord(date, branch, department, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in POST /api/production:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const branch = searchParams.get('branch');
    const department = searchParams.get('department');

    if (!date || !branch || !department) {
      return NextResponse.json(
        { success: false, message: 'Missing required query parameters' },
        { status: 400 }
      );
    }

    const record = await loadProductionRecord(date, branch, department);
    
    if (record) {
      return NextResponse.json({ success: true, data: record });
    } else {
      return NextResponse.json({ success: false, message: 'Record not found' });
    }
  } catch (error) {
    console.error('Error in GET /api/production:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const branch = searchParams.get('branch');
    const department = searchParams.get('department');

    if (!date || !branch || !department) {
      return NextResponse.json(
        { success: false, message: 'Missing required query parameters' },
        { status: 400 }
      );
    }

    const result = await deleteProductionRecord(date, branch, department);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in DELETE /api/production:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
