import axios from 'axios';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentGateway = async (details) => {
  try {
    console.log("Details received for payment:", details); // Debugging
    const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!loaded) {
      alert('Failed to load Razorpay script. Please try again.');
      return;
    }

    // Validate seat
    //const seat = Array.isArray(details.seats) && details.seats.length > 0 ? details.seats[0] : 'N/A';

    // Prepare options including passenger name and contact number
    const options = {
      Flight: details.flightID || 'Unknown',
      price: details.price || 0,
      deptCity: details.deptCity || 'Unknown',
      arrCity: details.arrCity || 'Unknown',
      date: details.date || 'Unknown',
      time: details.time || 'Unknown',
      seat:details.seats,
      passengerNames: details.passengerNames || 'Unknown Passenger',
      contact: details.contact || 'Unknown Contact',
    };

    console.log("Payment options:", options); // Debugging

    // Send options to backend to create order
    const res = await axios.post('http://localhost:5000/api/createTicket', options);
    const data = res.data;

    const paymentObject = new window.Razorpay({
      key: 'rzp_test_l8vZHcMBDT9xCG', // Replace with your Razorpay key
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      name: 'Flight Ticket',
      description: 'Flight Booking',
      handler: async (response) => {
        const verifyOptions = {
          razorpay_order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          flightDetails: options, // Pass flight details along with passenger name and contact
        };

        try {
          const verifyRes = await axios.post(
            'http://localhost:5000/api/verifyPayment',
            verifyOptions,
            { responseType: 'blob' }
            
          );

          const blob = new Blob([verifyRes.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `ticket_${response.razorpay_order_id}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          alert('Payment Successful! Your ticket is being downloaded.');
          window.location.href = "/thank-you";
        } catch (err) {
          console.error('Error in verifyPayment:', err);
          alert('Payment verification failed. Please try again.');
        }
      },
      prefill: {
        name: 'Your Name',
        email: 'youremail@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#3399cc',
      },
    });

    paymentObject.open();
  } catch (err) {
    console.error('Error in Payment:', err);
    alert('Payment initiation failed. Please try again.');
  }
};




export default PaymentGateway;