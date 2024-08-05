'use client'
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react';

const Home = () => {
  const { data, error, loading } = useFetch();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [amountToReceive, setAmountToReceive] = useState<string>('');
  const [amountToGive, setAmountToGive] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAmountToReceive = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountToReceive(e.target.value);
  };

  const calculateAmountToGive = () => {
    if (!selectedCurrency || !amountToReceive) {
      setErrorMessage('Please fill in all the fields.');
      setAmountToGive('');
      return;
    }

    setErrorMessage('');

    // Find the selected data based on the selectedCurrency
    const selectedData = data.find((item) => item.id === selectedCurrency);

    // If selectedData exists, calculate the amount to give
    if (selectedData) {
      // Convert the ask rate to a float
      const askRate = parseFloat(selectedData.ask);

      // Convert the amountToReceive to a float
      const amountToReceiveFloat = parseFloat(amountToReceive);

      // Calculate the amount to give by dividing the amountToReceive by the ask rate
      const amountToGiveFloat = amountToReceiveFloat / askRate;

      // Check if the amountToGiveFloat is a finite number
      if (isFinite(amountToGiveFloat)) {
        // Set the amountToGive to a fixed 2 decimal places
        setAmountToGive(amountToGiveFloat.toFixed(2));
        // Set the fromCurrency to the selectedData's from value
        setFromCurrency(selectedData.from);
      } else {
        // If the amountToGiveFloat is not a finite number, set the amountToGive to a message
        setAmountToGive('No conversions available for this transaction');
      }
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center mx-auto mt-14'>
        <Loader2 className='w-10 h-10 animate-spin text-gray-500' />
      </div>
    )
  }

  if (error) {
    return <div className='flex justify-center mx-auto mt-14'>Error: {error || "An error occurred"}</div>;
  }

  return (
    <div className='flex justify-center mx-auto mt-14 px-4 sm:px-6 lg:px-8'>
      <Card className="w-full max-w-lg h-auto">
        <CardHeader>
          <CardTitle>Currency Converter</CardTitle>
          <CardDescription>Calculate conversions between currencies</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Amount to receive</Label>
                <Input value={amountToReceive} onChange={handleAmountToReceive} id="amount" placeholder="Amount you want to receive" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="currency">Select currency conversion</Label>
                <Select value={selectedCurrency} onValueChange={(value) => {
                  setSelectedCurrency(value);
                  const selectedData = data.find((item) => item.id === value);
                  if (selectedData) {
                    setFromCurrency(selectedData.from);
                  }
                }}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select conversion" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {data.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.from} to {item.to}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-start flex-col w-full">
          {errorMessage && (
            <div className='text-red-500 mb-4'>{errorMessage}</div>
          )}
          {amountToGive && (
            <div className='flex flex-row items-center justify-start gap-1 mb-4'>
              <span className="text-md text-black">
                {amountToGive === 'No conversions available for this transaction' ? amountToGive : `You will have to give ${fromCurrency} `}
              </span>
              <span className="text-md font-semibold text-black">{amountToGive !== 'No conversions available for this transaction' && amountToGive}</span>
            </div>
          )}

          <Button onClick={calculateAmountToGive} className='w-full font-semibold'>Convert</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
