import { useState } from "react";
import { Container } from "@mui/material";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";

export default function Transactions() {
  const [refresh, setRefresh] = useState(false);

  return (
    <Container sx={{ mt: 4 }}>
      <TransactionForm onSuccess={() => setRefresh(!refresh)} />
      <TransactionList refresh={refresh} />
    </Container>
  );
}
