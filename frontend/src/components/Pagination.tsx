import { Stack, Button, Chip } from "@mui/material";
import {
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
} from "@mui/icons-material";

interface Props {
  page: number;
  setPage: (p: number) => void;
  totalPages?: number;
}

export default function Pagination({ page, setPage, totalPages }: Props) {
  return (
    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
      <Button
        variant="outlined"
        size="small"
        startIcon={<PrevIcon />}
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </Button>
      <Chip label={`Page ${page}${totalPages ? ` of ${totalPages}` : ""}`} variant="outlined" />
      <Button
        variant="outlined"
        size="small"
        endIcon={<NextIcon />}
        disabled={totalPages !== undefined && page >= totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </Stack>
  );
}
