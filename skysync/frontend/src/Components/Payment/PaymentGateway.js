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

const PaymentGateway = async (price, itemName) => {
  
  console.log("In payment gateway file",price);
  console.log(itemName);



  try {
    const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!loaded) {
      alert('Failed to load Razorpay script. Please try again.');
      return;
    }

    const options = {
      Flight: 'SG720',
      price: price,
    };

    // Create payment order on server
    const res = await axios.post('http://localhost:5000/api/createTicket', options);
    const data = res.data;

    const paymentObject = new window.Razorpay({
      key: 'rzp_test_l8vZHcMBDT9xCG', // Replace with your Razorpay test/live key
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      name: itemName,
      description: 'Flight Booking',
      handler: async (response) => {
        console.log("Payment response:", response);

        // Prepare data for verification
        const options2 = {
          razorpay_order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        };

        // Verify payment and download ticket
        try {
          const verifyRes = await axios.post(
            'http://localhost:5000/api/verifyPayment',
            options2,
            { responseType: 'blob' } // Expecting binary data for the PDF
          );

          // Create a blob URL and trigger download
          const blob = new Blob([verifyRes.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `ticket_${response.razorpay_order_id}.pdf`); // Set file name
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          alert('Payment Successful! Your ticket is being downloaded.');
        } catch (err) {
          console.error("Error in verifyPayment:", err.response ? err.response.data : err.message);
          alert('Payment verification failed. Please try again.');
        }
  }
,
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
    console.error('Error in Payment:', err.response ? err.response.data : err.message);
    alert('Payment initiation failed. Please try again.');
  }
};

export default PaymentGateway;