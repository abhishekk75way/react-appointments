import { Button } from "@mui/material";
import Grid from "@mui/material/GridLegacy";

const SlotPicker = ({ time }: { time: string }) => (
  <Grid item>
    <Button variant="outlined">{time}</Button>
  </Grid>
);

export default SlotPicker;
