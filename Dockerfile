FROM node:12-slim
LABEL name "accessibility-checker"

RUN apt-get update && apt-get install -yq curl gnupg2

# Install latest chrome dev package and fonts to support major
# charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version
# of Chromium that Puppeteer installs, work.
RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget --no-check-certificate -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

# It's a good idea to use dumb-init to help prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Create app directory
COPY . /app/
WORKDIR app

# Lint, test, and build the app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm run installBoth
RUN cd client && npm run eslint && npm run test && npm run build
RUN cd ..

# Expose port (doing prior to add user since 80 needs priviledged mode)
ENV PORT ${PORT:-80}
EXPOSE $PORT

# Add user so we don't need --no-sandbox.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser ./node_modules
USER pptruser

# Start app
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]
