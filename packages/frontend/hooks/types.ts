export interface ListApiResponse<Item> {
  data: Item[];
  cursor: string | null;
}
