import { Box, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

export function LinearProgressWithLabel({ value }: { value: number }) {
  return (
    <Box sx={styles.container}>
      <Box sx={styles.button}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box sx={styles.minWidth}>
        <Typography variant="body2" color="text.secondary">
          {Math.round(value)}%
        </Typography>
      </Box>
    </Box>
  );
}

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        mt: 3,
    },
    button: {
        mt: 3,
        py: 1.2,
    },
    loadingBox: {
        display: "flex",
        alignItems: "center",
        gap: 1,
    },
    loadingIcon: {
        color: "inherit",
    },
    footerBox: {
        textAlign: "center",
        mt: 2,
    },
    errorText: {
        mt: 2,
    },
    minWidth: {
        minWidth: 40,
    },
}