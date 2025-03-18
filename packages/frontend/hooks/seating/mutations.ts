import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@school/frontend/api';
import { SeatingSchemas } from '@core/seating';
import { SeatSchemas } from '@core/seat';
import { seatingKeys } from './keys';

export function useCreateSeating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      seating,
      seats,
      schoolId,
      classId,
    }: {
      seating: SeatingSchemas.Types.CreateInput;
      seats: Omit<SeatSchemas.Types.CreateInput, 'seatingId'>[];
      schoolId: string;
      classId: string;
    }) => {
      const res = await client.seating.$post({
        json: seating,
      });
      const newSeating = await res.json();

      if (seats.length > 0) {
        const seatsWithSeatingId = seats.map((seat) => ({
          ...seat,
          seatingId: newSeating.id,
        }));

        await client.seating[':seatingId'].seats.batch.$post({
          param: { seatingId: newSeating.id },
          json: seatsWithSeatingId,
        });
      }

      return newSeating;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: seatingKeys.list(variables.schoolId, variables.classId),
      });
    },
  });
}

export function useUpdateSeating(schoolId: string, classId: string, seatingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SeatingSchemas.Types.PatchInput) => {
      const response = await client.seating[':seatingId'].$put({
        param: { seatingId },
        json: data,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: seatingKeys.detail(schoolId, classId, seatingId),
      });
      queryClient.invalidateQueries({
        queryKey: seatingKeys.list(schoolId, classId),
      });
    },
  });
}

export function useDeleteSeating(schoolId: string, classId: string, seatingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await client.seating[':seatingId'].$delete({
        param: { seatingId },
      });
      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: seatingKeys.list(schoolId, classId),
      });
    },
  });
}
