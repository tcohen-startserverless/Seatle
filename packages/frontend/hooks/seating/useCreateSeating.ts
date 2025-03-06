import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SeatingSchemas } from '@core/seating';
import { SeatSchemas } from '@core/seat';

export function useCreateSeating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      seating,
      seats,
    }: {
      seating: SeatingSchemas.Types.CreateInput;
      seats: Omit<SeatSchemas.Types.CreateInput, 'seatingId'>[];
    }) => {
      // First create the seating arrangement
      const seatingResponse = await api.post('/seating', seating);
      const newSeating = await seatingResponse.json();
      
      // Then create all seats with the new seatingId
      if (seats.length > 0) {
        const seatsWithSeatingId = seats.map(seat => ({
          ...seat,
          seatingId: newSeating.id,
        }));
        
        await api.post(`/seating/${newSeating.id}/seats/batch`, seatsWithSeatingId);
      }
      
      return newSeating;
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['seating'] });
    },
  });
}