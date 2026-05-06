import type { Metadata } from 'next';
import RoomClient from './RoomClient';

export const metadata: Metadata = {
  title: 'Oda',
};

export default function RoomPage({ params }: { params: { secretId: string } }) {
  return <RoomClient secretId={params.secretId} />;
}
