import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await delay(500);
  return NextResponse.json({
    floors: mockDb.floors,
    tables: mockDb.tables,
    selectedFloorId: mockDb.selectedFloorId
  });
}

export async function POST(request) {
  await delay(500);
  try {
    const data = await request.json();
    
    // Set selectedFloorId action
    if (data.action === 'setSelectedFloorId') {
      mockDb.selectedFloorId = data.selectedFloorId;
      return NextResponse.json({ selectedFloorId: mockDb.selectedFloorId });
    }

    // Add floor action
    if (data.action === 'addFloor') {
      const newFloor = {
        id: data.id || `floor-${mockDb.floors.length + 1}`,
        name: data.name,
        order: mockDb.floors.length + 1,
        canvasWidth: 960,
        canvasHeight: 570
      };
      mockDb.floors.push(newFloor);
      return NextResponse.json(newFloor, { status: 201 });
    }

    // Delete floor action
    if (data.action === 'deleteFloor') {
      mockDb.floors = mockDb.floors.filter((f) => f.id !== data.floorId);
      mockDb.tables = mockDb.tables.filter((t) => t.floorId !== data.floorId);
      if (mockDb.selectedFloorId === data.floorId) {
        mockDb.selectedFloorId = mockDb.floors[0]?.id || '';
      }
      return NextResponse.json({ success: true, selectedFloorId: mockDb.selectedFloorId });
    }
    
    // Add table action
    const newTable = {
      status: 'available',
      x: 400,
      y: 240,
      width: 80,
      height: 80,
      rotation: 0,
      shape: 'rect',
      ...data
    };
    
    mockDb.tables.push(newTable);
    return NextResponse.json(newTable, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
