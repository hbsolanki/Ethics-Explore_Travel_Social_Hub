import { Typography } from "@material-tailwind/react";
import Footer from "./Footer";

export default function License() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <Typography as="h1" className="text-2xl font-bold text-gray-900">
            License Information
          </Typography>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <Typography
            as="h2"
            className="text-xl font-semibold text-gray-800 mb-4"
          >
            License Overview
          </Typography>
          <Typography className="text-gray-700 mb-4">
            This project is licensed under the MIT License. The MIT License is a
            permissive free software license that is simple and easy to
            understand. It places very few restrictions on reuse, making it a
            popular choice for open source projects.
          </Typography>
          <Typography
            as="h3"
            className="text-lg font-semibold text-gray-800 mb-2"
          >
            License Details
          </Typography>
          <Typography className="text-gray-700 mb-4">
            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files
            (the "Software"), to deal in the Software without restriction,
            including without limitation the rights to use, copy, modify, merge,
            publish, distribute, sublicense, and/or sell copies of the Software,
            and to permit persons to whom the Software is furnished to do so,
            subject to the following conditions:
          </Typography>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>
              The above copyright notice and this permission notice shall be
              included in all copies or substantial portions of the Software.
            </li>
            <li>
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
              NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
              HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
              WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
              DEALINGS IN THE SOFTWARE.
            </li>
          </ul>
          <Typography
            as="h3"
            className="text-lg font-semibold text-gray-800 mb-2"
          >
            Contact Information
          </Typography>
          <Typography className="text-gray-700">
            For any questions regarding the license or if you need more details,
            feel free to contact us at{" "}
            <a
              href="mailto:support@ethicshub.com"
              className="text-blue-500 hover:underline"
            >
              hbsolanki0524@gmail.com
            </a>
            .
          </Typography>
        </section>
      </main>

      <Footer />
    </div>
  );
}
