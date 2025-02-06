<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main class="container mx-auto px-4 py-8 flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>
